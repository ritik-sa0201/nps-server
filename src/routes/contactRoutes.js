import express from "express";
import { getContactInfo, updateContactInfo } from "../controller/contactController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/getContact", getContactInfo);

router.put("/update", protect, authorizeRoles("superadmin"), updateContactInfo);

export default router;
