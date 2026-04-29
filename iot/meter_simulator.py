import random
import time
import json
from datetime import datetime

def simulate_meter_reading(building_name):
    """Simulate PZEM-004T energy meter readings"""
    
    # Simulate realistic solar energy values
    hour = datetime.now().hour
    
    # Solar generation peaks during daytime (6am - 6pm)
    if 6 <= hour <= 18:
        solar_factor = 1.0 - abs(hour - 12) / 6.0
    else:
        solar_factor = 0.0
    
    # Base readings with some randomness
    voltage = round(random.uniform(218.0, 242.0), 1)
    current = round(random.uniform(0.5, 5.0) * solar_factor + 0.1, 2)
    power = round(voltage * current, 2)
    energy = round(random.uniform(0.1, 2.0) * solar_factor + 0.05, 3)
    frequency = round(random.uniform(49.8, 50.2), 1)
    
    reading = {
        "building": building_name,
        "timestamp": datetime.now().isoformat(),
        "voltage": voltage,
        "current": current,
        "power": power,
        "energy_kwh": energy,
        "frequency": frequency,
        "surplus": round(energy * 1000, 1)  # convert to Wh
    }
    
    return reading

if __name__ == "__main__":
    print("Starting meter simulator for FUT Minna CampusChain...")
    print("Press Ctrl+C to stop\n")
    
    buildings = ["Hostel A", "Lab Block", "Lecture Hall C", "Admin Block"]
    
    while True:
        for building in buildings:
            reading = simulate_meter_reading(building)
            print(f"[{reading['timestamp']}]")
            print(f"  Building  : {reading['building']}")
            print(f"  Voltage   : {reading['voltage']} V")
            print(f"  Current   : {reading['current']} A")
            print(f"  Power     : {reading['power']} W")
            print(f"  Energy    : {reading['energy_kwh']} kWh")
            print(f"  Surplus   : {reading['surplus']} Wh")
            print(f"  Frequency : {reading['frequency']} Hz")
            print("-" * 40)
        
        time.sleep(5)