import dotenv from "dotenv";
dotenv.config();
import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');
import express from "express";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import { connectDB } from "./config/db";
import { specs } from "./config/swagger";
import sessionRoutes from "./routes/sessionRoutes";
import authRoutes from "./routes/authRoutes";
import routerBooking from "./routes/bookingRoutes";
import dashboardRoutes from "./routes/dashboardRouter";


import { loggerMiddleware } from "./middlewares/loggerMiddleware";

import { errorHandler } from "./middlewares/errorMiddleware";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
// Logger
app.use(loggerMiddleware);

// Auth Routes
app.use("/api/auth", authRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/api/sessions", sessionRoutes);
app.use("/api", routerBooking);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
    res.send("Gym Booking API is running...");
});

// Global Error Handler
app.use(errorHandler);
app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server running on http://localhost:${PORT}`);
});