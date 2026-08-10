const express = require("express");
const cors = require("cors");
require("dotenv").config();

const energyRoutes = require("./routes/energy");
const { startMQTTSubscriber, getLatestReadings, isConnected } = require("./services/mqttService");
const { TOKEN_ADDRESS, TRADE_ADDRESS } = require("./services/contractService");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api/energy", energyRoutes);

/** Latest IoT meter readings for every building. */
app.get("/api/meters", (req, res) => {
    const readings = getLatestReadings();
    res.json({
        success: true,
        mqttConnected: isConnected(),
        count: Object.keys(readings).length,
        readings,
    });
});

/** Health check. */
app.get("/", (req, res) => {
    res.json({
        message: "CampusChain Backend API is running",
        status: "online",
        mode: "read-only (transactions are signed client-side in MetaMask)",
        mqttConnected: isConnected(),
        contracts: {
            energyToken: TOKEN_ADDRESS,
            energyTrade: TRADE_ADDRESS,
        },
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, error: `No route for ${req.method} ${req.originalUrl}` });
});

// Error handler
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err.message);
    res.status(500).json({ success: false, error: "Internal server error" });
});

startMQTTSubscriber();

app.listen(PORT, () => {
    console.log(`CampusChain backend running on port ${PORT}`);
    console.log(`  Health:   http://localhost:${PORT}/`);
    console.log(`  Meters:   http://localhost:${PORT}/api/meters`);
    console.log(`  Listings: http://localhost:${PORT}/api/energy/listings`);
});
