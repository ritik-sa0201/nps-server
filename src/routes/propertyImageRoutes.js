import express from "express";
import multer from "multer";
import { uploadPropertyImages } from "../controller/propertyImageController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/property/upload-images",
  protect,
  authorizeRoles("admin", "superadmin"),
  upload.array("images", 20),
  uploadPropertyImages
);

export default router;
