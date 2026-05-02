const mqtt = require("mqtt");

const BROKER = "mqtt://broker.hivemq.com";
const TOPIC_BASE = "campuschain/futminna/#";

let latestReadings = {};

function startMQTTSubscriber() {
    const client = mqtt.connect(BROKER);

    client.on("connect", () => {
        console.log("Backend connected to MQTT broker");
        client.subscribe(TOPIC_BASE, (err) => {
            if (!err) {
                console.log(`Subscribed to ${TOPIC_BASE}`);
            }
        });
    });

    client.on("message", (topic, message) => {
        try {
            const reading = JSON.parse(message.toString());
            const building = reading.building;
            latestReadings[building] = reading;
            console.log(`Received reading from ${building}: ${reading.power}W`);
        } catch (err) {
            console.error("Error parsing MQTT message:", err.message);
        }
    });

    client.on("error", (err) => {
        console.error("MQTT error:", err.message);
    });
}

function getLatestReadings() {
    return latestReadings;
}

module.exports = { startMQTTSubscriber, getLatestReadings };