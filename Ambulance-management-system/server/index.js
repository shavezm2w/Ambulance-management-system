import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import tripRoutes from "./routes/trips.js";
import ambulanceRoutes from "./routes/ambulances.js";
import driverRoutes from "./routes/drivers.js";
import hospitalRoutes from "./routes/hospitals.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/ambulances", ambulanceRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/hospitals", hospitalRoutes);

// Serve React build in production
app.use(express.static(path.join(__dirname, "../dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
