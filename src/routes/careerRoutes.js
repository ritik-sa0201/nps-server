import express from "express";
import {
  getAllJobs,
  createJob,
  updateJob,
  deleteJob,
} from "../controller/careerController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/fetch", getAllJobs);

router.post("/create", protect, authorizeRoles("admin", "superadmin"), createJob);
router.put("/update/:id", protect, authorizeRoles("admin", "superadmin"), updateJob);
router.delete("/delete/:id", protect, authorizeRoles("admin", "superadmin"), deleteJob);

export default router;
