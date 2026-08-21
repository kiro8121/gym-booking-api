import { Router } from "express";

import { 
    create_session, 
    get_all_sessions, 
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

// 1. Get all sessions 
router.get("/", get_all_sessions);

// 2. Get session by ID 
router.get("/:id", get_session_by_id);

// 3. Create session 
router.post(
    "/", 
    authenticate, 
    authorize("Trainer", "trainer"), 
    validate_create_session, 
    create_session
);

// 4. Update session 
router.put(
    "/:id", 
    authenticate, 
    authorize("Trainer", "trainer"), 
    validate_update_session, 
    update_session
);

// 5. Delete session 
router.delete(
    "/:id", 
    authenticate, 
    authorize("Trainer", "trainer"), 
    delete_session
);

export default router;