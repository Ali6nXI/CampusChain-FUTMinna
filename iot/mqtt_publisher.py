import paho.mqtt.client as mqtt
import json
import time
import random
from datetime import datetime
from meter_simulator import simulate_meter_reading

# Free public MQTT broker - no setup needed
BROKER = "broker.hivemq.com"
PORT = 1883
TOPIC_BASE = "campuschain/futminna"

buildings = ["Hostel A", "Lab Block", "Lecture Hall C", "Admin Block"]

def on_connect(client, userdata, flags, rc, properties=None):
    if rc == 0:
        print(f"Connected to MQTT broker: {BROKER}")
    else:
        print(f"Connection failed with code: {rc}")

def on_publish(client, userdata, mid, reason_code=None, properties=None):
    print(f"Message published successfully (mid={mid})")

def main():
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, 
                         client_id=f"campuschain-{random.randint(1000,9999)}")
    client.on_connect = on_connect
    client.on_publish = on_publish

    print(f"Connecting to {BROKER}:{PORT}...")
    client.connect(BROKER, PORT, 60)
    client.loop_start()

    time.sleep(2)

    print("\nStarting CampusChain IoT Simulator...")
    print("Publishing meter readings every 10 seconds")
    print("Press Ctrl+C to stop\n")

    try:
        while True:
            for building in buildings:
                reading = simulate_meter_reading(building)
                topic = f"{TOPIC_BASE}/{building.replace(' ', '_').lower()}"
                payload = json.dumps(reading)

                result = client.publish(topic, payload, qos=1)
                result.wait_for_publish()

                print(f"Published to {topic}")
                print(f"  Power: {reading['power']} W | Energy: {reading['energy_kwh']} kWh | Surplus: {reading['surplus']} Wh")

            print(f"\nNext reading in 10 seconds...\n")
            time.sleep(10)

    except KeyboardInterrupt:
        print("\nStopping publisher...")
        client.loop_stop()
        client.disconnect()

if __name__ == "__main__":
    main()