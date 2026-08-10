import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import {
    CHAIN_ID,
    CHAIN_ID_HEX,
    AMOY_PARAMS,
    ENERGY_TOKEN_ADDRESS,
    ENERGY_TRADE_ADDRESS,
    ENERGY_TOKEN_ABI,
    ENERGY_TRADE_ABI,
} from "../contracts";

/**
 * Wallet hook for CampusChain.
 *
 * Unlike the previous version, the signer returned here is actually used by the
 * pages to submit transactions. Every trade therefore originates from the
 * connected user's own account, which is what makes the system peer-to-peer
 * rather than custodial.
 */
export function useWallet() {
    const [account, setAccount] = useState(null);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [chainId, setChainId] = useState(null);
    const [connecting, setConnecting] = useState(false);
    const [error, setError] = useState(null);

    const wrongNetwork = chainId !== null && Number(chainId) !== CHAIN_ID;

    const connectWallet = useCallback(async () => {
        setError(null);
        if (!window.ethereum) {
            setError("MetaMask not found. Install the MetaMask browser extension to continue.");
            return;
        }
        setConnecting(true);
        try {
            const web3Provider = new ethers.BrowserProvider(window.ethereum);
            await web3Provider.send("eth_requestAccounts", []);
            const web3Signer = await web3Provider.getSigner();
            const address = await web3Signer.getAddress();
            const net = await web3Provider.getNetwork();

            setProvider(web3Provider);
            setSigner(web3Signer);
            setAccount(address);
            setChainId(Number(net.chainId));
        } catch (err) {
            // 4001 = user rejected the request
            setError(err?.code === 4001 ? "Connection request rejected." : (err?.message || "Wallet connection failed."));
        } finally {
            setConnecting(false);
        }
    }, []);

    /** Prompt MetaMask to switch to Amoy, adding the network if unknown. */
    const switchToAmoy = useCallback(async () => {
        if (!window.ethereum) return;
        try {
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: CHAIN_ID_HEX }],
            });
        } catch (err) {
            // 4902 = chain not added to this wallet yet
            if (err?.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [AMOY_PARAMS],
                    });
                } catch (addErr) {
                    setError(addErr?.message || "Could not add the Polygon Amoy network.");
                }
            } else {
                setError(err?.message || "Could not switch network.");
            }
        }
    }, []);

    const disconnect = useCallback(() => {
        setAccount(null);
        setSigner(null);
        setProvider(null);
        setChainId(null);
        setError(null);
    }, []);

    // React to account and network changes without requiring a page reload.
    useEffect(() => {
        if (!window.ethereum) return;

        const onAccountsChanged = async (accounts) => {
            if (!accounts || accounts.length === 0) {
                disconnect();
                return;
            }
            const p = new ethers.BrowserProvider(window.ethereum);
            const s = await p.getSigner();
            setProvider(p);
            setSigner(s);
            setAccount(await s.getAddress());
        };

        const onChainChanged = async (hexChainId) => {
            setChainId(parseInt(hexChainId, 16));
            const p = new ethers.BrowserProvider(window.ethereum);
            setProvider(p);
            try {
                const s = await p.getSigner();
                setSigner(s);
                setAccount(await s.getAddress());
            } catch {
                /* wallet locked */
            }
        };

        window.ethereum.on("accountsChanged", onAccountsChanged);
        window.ethereum.on("chainChanged", onChainChanged);
        return () => {
            window.ethereum.removeListener("accountsChanged", onAccountsChanged);
            window.ethereum.removeListener("chainChanged", onChainChanged);
        };
    }, [disconnect]);

    // Restore an already-authorised session on page load.
    useEffect(() => {
        (async () => {
            if (!window.ethereum) return;
            try {
                const accounts = await window.ethereum.request({ method: "eth_accounts" });
                if (accounts && accounts.length > 0) {
                    const p = new ethers.BrowserProvider(window.ethereum);
                    const s = await p.getSigner();
                    const net = await p.getNetwork();
                    setProvider(p);
                    setSigner(s);
                    setAccount(await s.getAddress());
                    setChainId(Number(net.chainId));
                }
            } catch {
                /* ignore */
            }
        })();
    }, []);

    /** Contract instances bound to the user's signer (write-capable). */
    const getContracts = useCallback(() => {
        if (!signer) return null;
        return {
            token: new ethers.Contract(ENERGY_TOKEN_ADDRESS, ENERGY_TOKEN_ABI, signer),
            trade: new ethers.Contract(ENERGY_TRADE_ADDRESS, ENERGY_TRADE_ABI, signer),
        };
    }, [signer]);

    return {
        account,
        provider,
        signer,
        chainId,
        wrongNetwork,
        connecting,
        error,
        connectWallet,
        switchToAmoy,
        disconnect,
        getContracts,
    };
}
