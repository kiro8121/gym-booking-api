import express from "express";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db";
import { specs } from "./config/swagger";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.get("/", (req, res) => {
    res.send("Gym Booking API is running...");
});

app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server running on http://localhost:${PORT}`);
});