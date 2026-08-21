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
import authRoutes from "./routes/auth_routes";
import routerBooking from "./routes/routerBooking";
import validateBookingData from "./middlewares/validateBookingData";
import dashboardRoutes from "./routes/dashboard.router";


// authRoutes feha routes beta3t authentication
// register / login / me


import { loggerMiddleware } from "./middlewares/loggerMiddleware";
// loggerMiddleware bysagel kol request da5el el server
// method + URL + status + execution time


import { errorHandler } from "./middlewares/errorMiddleware";
import auth_routes from "./routes/auth_routes";
// errorHandler howa Global Error Handler
// ay error y7sal fe el app momken ywsal lel middleware da



const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
// Logger
app.use(loggerMiddleware);
// ay request ted5ol el server
// تعدي 3ala logger 3ashan nsagel details beta3tha

// Auth Routes
app.use("/api/auth", auth_routes);
// kol routes beta3t el authentication هتبدأ بـ /api/auth
//
// POST /api/auth/register
// POST /api/auth/login
// GET  /api/auth/me
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/api/sessions", sessionRoutes);
app.use("/api", routerBooking);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
    res.send("Gym Booking API is running...");
});

// Global Error Handler
app.use(errorHandler);
// lazm ykoon ba3d kol el routes
// 3ashan ay error y7sal fe ay controller
// ywsal lel errorHandler
app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server running on http://localhost:${PORT}`);
});