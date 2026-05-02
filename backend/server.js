const express = require("express");
const cors = require("cors");
require("dotenv").config();

const energyRoutes = require("./routes/energy");
const { startMQTTSubscriber, getLatestReadings } = require("./services/mqttService");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/energy", energyRoutes);

// IoT meter readings endpoint
app.get("/api/meters", (req, res) => {
    const readings = getLatestReadings();
    res.json({ success: true, readings });
});

// Health check
app.get("/", (req, res) => {
    res.json({
        message: "CampusChain Backend API is running",
        status: "online",
        contracts: {
            energyToken: process.env.ENERGY_TOKEN_ADDRESS,
            energyTrade: process.env.ENERGY_TRADE_ADDRESS,
        }
    });
});

// Start MQTT subscriber
startMQTTSubscriber();

app.listen(PORT, () => {
    console.log(`CampusChain backend running on port ${PORT}`);
});