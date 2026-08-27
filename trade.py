#!/usr/bin/env python3
"""
CampusChain manual trade controller.

Fires the trade signal that the library node polls, switching on its
LED and fan. Use this to demonstrate the trade without needing the
solar panel to generate surplus.

Usage
    python trade.py           interactive menu
    python trade.py on        switch the load ON and leave it on
    python trade.py off       switch the load OFF
    python trade.py demo      ON for 15s, then OFF automatically
    python trade.py status    show the current flag
"""

import json, sys, time, urllib.request
from datetime import datetime

DB = "https://campuschain-715f6-default-rtdb.firebaseio.com"


def stamp():
    return datetime.now().strftime("%H:%M:%S")


def get(path):
    with urllib.request.urlopen(f"{DB}/{path}.json", timeout=10) as r:
        return json.loads(r.read().decode())


def put(path, value):
    req = urllib.request.Request(
        f"{DB}/{path}.json",
        data=json.dumps(value).encode(),
        method="PUT",
        headers={"Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=10) as r:
        return r.status


def fire():
    put("trade/value", True)
    print(f"[{stamp()}]  TRADE SENT       library LED + fan should switch ON within 3 s")


def clear():
    put("trade/value", False)
    print(f"[{stamp()}]  TRADE CLEARED    library node returns to WAITING")


def status():
    v = get("trade/value")
    node = get("nodes/hostel") or {}
    print(f"[{stamp()}]  trade flag : {v}")
    print(f"            hostel     : {node.get('voltage','?')} V   "
          f"{node.get('power','?')} mW   surplus {node.get('surplus','?')} mW")


def demo(hold=15):
    fire()
    for s in range(hold, 0, -1):
        print(f"            load on, clearing in {s:2d}s ", end="\r", flush=True)
        time.sleep(1)
    print(" " * 46, end="\r")
    clear()


if __name__ == "__main__":
    arg = sys.argv[1].lower() if len(sys.argv) > 1 else None

    if arg == "on":
        fire()
    elif arg == "off":
        clear()
    elif arg == "demo":
        demo()
    elif arg == "status":
        status()
    else:
        print("=" * 58)
        print("  CampusChain trade controller")
        print("=" * 58)
        status()
        print()
        print("  1  fire trade      (LED + fan ON)")
        print("  2  clear trade     (LED + fan OFF)")
        print("  3  demo            (ON for 15s, then auto OFF)")
        print("  4  status")
        print("  q  quit")
        print()
        while True:
            try:
                c = input("  > ").strip().lower()
            except (EOFError, KeyboardInterrupt):
                print("\n  bye"); break
            if c == "1": fire()
            elif c == "2": clear()
            elif c == "3": demo()
            elif c == "4": status()
            elif c in ("q", "quit", "exit"):
                print("  bye"); break
            else:
                print("  choose 1, 2, 3, 4 or q")
