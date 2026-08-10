const mqtt = require("mqtt");

const BROKER = process.env.MQTT_BROKER || "mqtt://broker.hivemq.com";
const TOPIC_BASE = process.env.MQTT_TOPIC || "campuschain/futminna/#";

// Latest reading per building, kept in memory.
let latestReadings = {};
let connected = false;

// Expected shape of an incoming meter payload.
const NUMERIC_FIELDS = ["voltage", "current", "power", "energy_kwh", "surplus"];

function isValidReading(r) {
    if (!r || typeof r !== "object") return false;
    if (typeof r.building !== "string" || !r.building.trim()) return false;
    return NUMERIC_FIELDS.every((f) => typeof r[f] === "number" && Number.isFinite(r[f]));
}

function startMQTTSubscriber() {
    const client = mqtt.connect(BROKER, {
        reconnectPeriod: 5000,
        connectTimeout: 30000,
    });

    client.on("connect", () => {
        connected = true;
        console.log(`Backend connected to MQTT broker: ${BROKER}`);
        client.subscribe(TOPIC_BASE, { qos: 1 }, (err) => {
            if (err) console.error("MQTT subscribe failed:", err.message);
            else console.log(`Subscribed to ${TOPIC_BASE}`);
        });
    });

    client.on("message", (topic, message) => {
        try {
            const reading = JSON.parse(message.toString());

            // Reject malformed payloads. The topic is a public broker, so
            // anything at all can be published to it.
            if (!isValidReading(reading)) {
                console.warn(`Discarded malformed reading on ${topic}`);
                return;
            }

            latestReadings[reading.building] = {
                ...reading,
                receivedAt: new Date().toISOString(),
            };
        } catch (err) {
            console.warn(`Unparseable MQTT message on ${topic}: ${err.message}`);
        }
    });

    client.on("reconnect", () => console.log("MQTT reconnecting..."));
    client.on("close", () => { connected = false; });
    client.on("error", (err) => console.error("MQTT error:", err.message));

    return client;
}

function getLatestReadings() {
    return latestReadings;
}

function isConnected() {
    return connected;
}

module.exports = { startMQTTSubscriber, getLatestReadings, isConnected };
