import express from "express";
import { getAdmins, getUserRoleCounts,setRole,getAllUsers } from "../controller/adminController.js";
import { protect,authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/role-counts", protect, getUserRoleCounts);
router.get("/admins",protect,getAdmins);
router.post("/setRole", protect, setRole);
router.get("/users", protect, getAllUsers);
export default router;
