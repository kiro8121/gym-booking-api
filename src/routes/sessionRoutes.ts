import { Router } from "express";

import { 
    create_session, 
    get_session_by_id, 
    delete_session, 
    update_session 
} from "../controllers/sessionController";

import { 
    validate_create_session, 
    validate_update_session 
} from "../middlewares/sessionValidation  ";

import { authenticate, authorize } from "../middlewares/auth_auth_middleware";

const router = Router();

/**
 * @swagger
 * /api/sessions:
 *   get:
 *     summary: Get all available class sessions
 *     tags: [Sessions]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Search sessions by title
 *
 *       - in: query
 *         name: trainer
 *         schema:
 *           type: string
 *         description: Filter sessions by trainer ID
 *
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter sessions by date
 *
 *       - in: query
 *         name: availableOnly
 *         schema:
 *           type: boolean
 *         description: Return only sessions with available spots
 *
 *     responses:
 *       200:
 *         description: List of sessions
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * /api/sessions/{id}:
 *   get:
 *     summary: Get a session by ID
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Session ID
 *     responses:
 *       200:
 *         description: Session retrieved successfully
 *       404:
 *         description: Session not found
 *       500:
 *         description: Server error
 */
// 2. Get session by ID 
router.get("/:id", get_session_by_id);

/**
 * @swagger
 * /api/sessions:
 *   post:
 *     summary: Create a new class session
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - time_slot
 *               - capacity
 *             properties:
 *               title:
 *                 type: string
 *                 example: Yoga
 *               time_slot:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-09-01T18:00:00Z
 *               capacity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 20
 *     responses:
 *       201:
 *         description: Session created successfully
 *       400:
 *         description: Invalid session data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only trainers can create sessions
 *       500:
 *         description: Server error
 */
// 3. Create session 
router.post(
    "/", 
    authenticate, 
    authorize("Trainer", "trainer"), 
    validate_create_session, 
    create_session
);

/**
 * @swagger
 * /api/sessions/{id}:
 *   put:
 *     summary: Update a class session
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Session ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Advanced Yoga
 *               time_slot:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-09-01T19:00:00Z
 *               capacity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 25
 *     responses:
 *       200:
 *         description: Session updated successfully
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: You are not the owner of this session
 *       404:
 *         description: Session not found
 *       500:
 *         description: Server error
 */
// 4. Update session 
router.put(
    "/:id", 
    authenticate, 
    authorize("Trainer", "trainer"), 
    validate_update_session, 
    update_session
);

/**
 * @swagger
 * /api/sessions/{id}:
 *   delete:
 *     summary: Delete a class session
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Session ID
 *     responses:
 *       200:
 *         description: Session deleted successfully
 *       400:
 *         description: Cannot delete a session with active bookings
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: You are not the owner of this session
 *       404:
 *         description: Session not found
 *       500:
 *         description: Server error
 */
// 5. Delete session 
router.delete(
    "/:id", 
    authenticate, 
    authorize("Trainer", "trainer"), 
    delete_session
);

export default router;