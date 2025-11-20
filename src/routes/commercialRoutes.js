import express from "express";
import {
  createCommercialProperty,
  getAllCommercialProperties,
  getCommercialPropertyById,
  updateCommercialProperty,
  deleteCommercialProperty,
} from "../controller/commercial-property.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post(
  "/create",
  protect,
  authorizeRoles("admin", "superadmin"),
  createCommercialProperty
);


router.get("/all", getAllCommercialProperties);

router.get("/:id", getCommercialPropertyById);

router.put(
  "/:id",
  protect,
  authorizeRoles("admin", "superadmin"),
  updateCommercialProperty
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin", "superadmin"),
  deleteCommercialProperty
);

export default router;
