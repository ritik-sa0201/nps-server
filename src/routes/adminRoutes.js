import express from "express";
import { getAdmins, getUserRoleCounts } from "../controller/adminController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/role-counts", protect, getUserRoleCounts);
router.get("/admins",protect,getAdmins);

export default router;
