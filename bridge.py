#!/usr/bin/env python3
"""
CampusChain hardware bridge.

Watches the hostel node's surplus in Firebase. When surplus exceeds the
threshold it raises /trade/value = true, which the library node polls and
responds to by switching on its LED and fan.

Also mirrors hostel readings into /meters so the public GitHub Pages
dashboard shows live hardware data.

Run:  python bridge.py
Stop: Ctrl+C
"""

import json, time, urllib.request, sys
from datetime import datetime

DB        = "https://campuschain-715f6-default-rtdb.firebaseio.com"
THRESHOLD = 100.0     # mW of surplus needed to trigger a trade
POLL      = 2.0       # seconds between checks
HOLD      = 15.0      # seconds the trade flag stays raised


def get(path):
    with urllib.request.urlopen(f"{DB}/{path}.json", timeout=10) as r:
        return json.loads(r.read().decode())


def put(path, value):
    data = json.dumps(value).encode()
    req = urllib.request.Request(f"{DB}/{path}.json", data=data, method="PUT",
                                 headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=10) as r:
        return r.status


def stamp():
    return datetime.now().strftime("%H:%M:%S")


print("=" * 62)
print("  CampusChain hardware bridge")
print(f"  threshold: surplus > {THRESHOLD} mW    poll: {POLL}s")
print("=" * 62)
print("  Ctrl+C to stop\n")

put("trade/value", False)
print(f"[{stamp()}] trade flag reset to false\n")

traded_at = 0.0
last_line = ""

try:
    while True:
        try:
            node = get("nodes/hostel") or {}
        except Exception as e:
            print(f"[{stamp()}] read failed: {str(e)[:50]}")
            time.sleep(POLL); continue

        power   = float(node.get("power", 0) or 0)
        volts   = float(node.get("voltage", 0) or 0)
        surplus = float(node.get("surplus", 0) or 0)
        now     = time.time()

        # mirror into /meters so the public dashboard shows it
        try:
            put("meters/HostelA", {
                "building": "HostelA",
                "voltage":  round(volts, 2),
                "current":  round((power / volts / 1000) if volts else 0, 3),
                "power":    round(power, 1),
                "energy":   round(power / 1000, 3),
                "timestamp": {".sv": "timestamp"},
            })
        except Exception:
            pass

        active = get("trade/value") is True

        if surplus > THRESHOLD and not active:
            put("trade/value", True)
            traded_at = now
            print(f"[{stamp()}]  TRADE TRIGGERED  surplus {surplus:.1f} mW  "
                  f"-> library LED + fan ON")

        elif active and traded_at and (now - traded_at) > HOLD:
            put("trade/value", False)
            traded_at = 0.0
            print(f"[{stamp()}]  trade flag cleared (ready for next trade)")

        else:
            line = (f"[{stamp()}]  V {volts:6.2f}   P {power:8.1f} mW   "
                    f"surplus {surplus:8.1f} mW   "
                    f"{'TRADING' if active else 'idle'}")
            if line[10:] != last_line[10:]:
                print(line)
                last_line = line

        time.sleep(POLL)

except KeyboardInterrupt:
    put("trade/value", False)
    print(f"\n[{stamp()}] stopped, trade flag reset to false")
