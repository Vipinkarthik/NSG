import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectMongo from "./config/mongo.js";
import authRoutes from "./routes/authRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";
import cameraRoutes from "./routes/cameraRoutes.js";
import detectionRoutes from "./routes/detectionRoutes.js";

dotenv.config();
connectMongo();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/camera", cameraRoutes);
app.use("/api/detection", detectionRoutes);

app.get("/", (req, res) => {
  res.json({ status: "NSG Auth Backend Running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
