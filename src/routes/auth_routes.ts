import { Router } from 'express';
// Router بنستخدمه 3ashan n3ml routes lel auth

import {
    register,
    login,
    getMe
} from '../controllers/auth_controlers';
// bngeb el functions ely hn3mlha run 3and kol route
// register = إنشاء account
// login = تسجيل الدخول
// getMe = جلب بيانات الuser الحالي

import { authenticate } from '../middlewares/auth_auth_middleware';
// authenticate byet2aked en el user logged in
// ya3ny byverify el JWT token


const router = Router();
// bn3ml Router gded 3ashan n7ot feh routes beta3t el auth

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - password
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Karen Milad
 *               email:
 *                 type: string
 *                 format: email
 *                 example: karen@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: StrongPass123
 *               role:
 *                 type: string
 *                 enum: [Member, Trainer]
 *                 example: Member
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Missing fields or email already exists
 */
router.post('/register', register);
// POST /register
// لما user يعمل register
// Express hyro7 ينفذ register controller

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: karen@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: StrongPass123
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 */
router.post('/login', login);
// POST /login
// لما user يعمل login
// hyro7 ينفذ login controller

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current logged-in user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user information
 *       401:
 *         description: Unauthorized
 */
router.get('/me', authenticate, getMe);
// GET /me
// authenticate awel 7aga byet2aked en el user logged in
// law el token sa7 → yroo7 getMe
// law el token 8alat → authenticate ywa2af el request


export default router;
// bnexport el router 3ashan nst5dmo fe server.ts