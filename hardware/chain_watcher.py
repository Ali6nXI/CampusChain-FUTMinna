#!/usr/bin/env python3
"""
CampusChain chain watcher.

Watches the EnergyTrade contract on Polygon Amoy. When a listing flips
from active to sold - which is what buyEnergy() does - it raises
/trade/value = true in Firebase. The library node polls that flag and
energises its LED and fan.

So: buy energy in MetaMask  ->  contract settles  ->  watcher sees it
    ->  Firebase flag  ->  fan spins.

Nothing here can fake a trade. The flag only rises when the contract
state actually changes on-chain.

Run:   python chain_watcher.py
Stop:  Ctrl+C
"""

import json, time, urllib.request
from datetime import datetime

RPCS = [
    "https://polygon-amoy-bor-rpc.publicnode.com",
    "https://polygon-amoy.drpc.org",
    "https://polygon-amoy.gateway.tenderly.co",
]
TRADE = "0xE82A1Daad1c4564A4741502c33b4cE4322Da2dc0"
DB    = "https://campuschain-715f6-default-rtdb.firebaseio.com"

SEL_COUNT = "0xa9b07c26"   # listingCount()
SEL_GET   = "0x1030f05f"   # getActiveListing(uint256)

POLL = 4        # seconds between chain checks
HOLD = 20       # seconds the load stays energised


def stamp():
    return datetime.now().strftime("%H:%M:%S")


def rpc(data, rpc_i=0):
    body = json.dumps({"jsonrpc": "2.0", "id": 1, "method": "eth_call",
                       "params": [{"to": TRADE, "data": data}, "latest"]}).encode()
    last = None
    for i in range(len(RPCS)):
        url = RPCS[(rpc_i + i) % len(RPCS)]
        try:
            req = urllib.request.Request(url, data=body,
                                         headers={"Content-Type": "application/json"})
            with urllib.request.urlopen(req, timeout=12) as r:
                j = json.loads(r.read().decode())
            if "result" in j:
                return j["result"]
            last = j.get("error")
        except Exception as e:
            last = str(e)[:50]
    raise RuntimeError(f"all RPCs failed: {last}")


def put(path, value):
    req = urllib.request.Request(f"{DB}/{path}.json",
                                 data=json.dumps(value).encode(),
                                 method="PUT",
                                 headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=10) as r:
        return r.status


def word(hexs, i):
    return hexs[2 + i * 64: 2 + (i + 1) * 64]


def listing_count():
    return int(rpc(SEL_COUNT), 16)


def listing_state(i):
    """Return (name, energy, isActive) for listing i."""
    raw = rpc(SEL_GET + hex(i)[2:].rjust(64, "0"))
    base = int(word(raw, 0), 16) // 32
    energy = int(word(raw, base + 3), 16)
    active = int(word(raw, base + 5), 16) == 1
    stroff = int(word(raw, base + 2), 16) // 32
    ln = int(word(raw, base + stroff), 16)
    name = ""
    if 0 < ln < 128:
        hx = ""
        for w in range((ln + 31) // 32):
            hx += word(raw, base + stroff + 1 + w)
        name = bytes.fromhex(hx[:ln * 2]).decode("utf-8", "replace")
    return name, energy, active


print("=" * 66)
print("  CampusChain chain watcher")
print("  contract  ", TRADE)
print(f"  polling every {POLL}s   load holds {HOLD}s after a trade")
print("=" * 66)
print("  Buy energy in MetaMask and the fan will start.")
print("  Ctrl+C to stop\n")

put("trade/value", False)
print(f"[{stamp()}] trade flag reset\n")

# snapshot current state
try:
    n = listing_count()
    state = {}
    for i in range(1, n + 1):
        nm, wh, act = listing_state(i)
        state[i] = act
    active_n = sum(1 for v in state.values() if v)
    print(f"[{stamp()}] baseline: {n} listings, {active_n} active, {n - active_n} sold")
    print(f"[{stamp()}] watching for a purchase...\n")
except Exception as e:
    print(f"[{stamp()}] could not read contract: {e}")
    raise SystemExit(1)

fired_at = 0.0

try:
    while True:
        time.sleep(POLL)
        try:
            n2 = listing_count()

            # any new listing?
            if n2 > n:
                for i in range(n + 1, n2 + 1):
                    nm, wh, act = listing_state(i)
                    state[i] = act
                    print(f"[{stamp()}]  NEW LISTING  #{i} \"{nm}\" {wh} Wh")
                n = n2

            # any listing flipped active -> sold?
            for i in range(1, n + 1):
                nm, wh, act = listing_state(i)
                was = state.get(i, act)
                if was and not act:
                    print(f"[{stamp()}]  TRADE DETECTED  listing #{i} \"{nm}\" "
                          f"{wh} Wh sold on-chain")
                    put("trade/value", True)
                    fired_at = time.time()
                    print(f"[{stamp()}]  -> flag raised, library load energising")
                state[i] = act

            if fired_at and (time.time() - fired_at) > HOLD:
                put("trade/value", False)
                fired_at = 0.0
                print(f"[{stamp()}]  load cleared, ready for the next trade\n")

        except Exception as e:
            print(f"[{stamp()}] poll error: {str(e)[:60]}")

except KeyboardInterrupt:
    put("trade/value", False)
    print(f"\n[{stamp()}] stopped, trade flag reset")
