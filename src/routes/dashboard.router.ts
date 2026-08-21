import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboard.controller";

const router = Router();

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalMembers:
 *                   type: integer
 *                   example: 25
 *                 totalTrainers:
 *                   type: integer
 *                   example: 5
 *                 totalSessions:
 *                   type: integer
 *                   example: 12
 *                 totalBookings:
 *                   type: integer
 *                   example: 48
 *                 busiestClass:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: Yoga
 *                     bookings:
 *                       type: integer
 *                       example: 10
 *       500:
 *         description: Server error while fetching dashboard statistics
 */
router.get("/", getDashboardStats);

export default router;