import { useState } from "react";
import { ethers } from "ethers";

export function useWallet() {
    const [account, setAccount] = useState(null);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);

    const connectWallet = async () => {
        try {
            if (!window.ethereum) {
                alert("MetaMask not found. Please install MetaMask extension.");
                return;
            }

            const web3Provider = new ethers.BrowserProvider(window.ethereum);
            await web3Provider.send("eth_requestAccounts", []);
            const web3Signer = await web3Provider.getSigner();
            const address = await web3Signer.getAddress();

            setProvider(web3Provider);
            setSigner(web3Signer);
            setAccount(address);

            console.log("Wallet connected:", address);
        } catch (error) {
            console.error("Wallet connection failed:", error);
        }
    };

    return { account, provider, signer, connectWallet };
}