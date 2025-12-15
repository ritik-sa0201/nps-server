import express from "express";
import {
  createProperty,
  getAllProperties,
  updateProperty,
  deleteProperty,
} from "../controller/resedential-property.js"
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/create",protect, authorizeRoles("admin", "superadmin"), createProperty);


router.get("/all", getAllProperties);

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const property = await import("../mongoDb/models/resedential-property.js")
      .then((mod) => mod.default.findById(id))
      .catch(() => null);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    res.status(200).json({
      success: true,
      data: property,
    });
    console.log(property);
  } catch (error) {
    console.error("Error fetching property:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch property",
      error: error.message,
    });
  }
});

// ✏️ Update a property
router.put("/:id",protect, authorizeRoles("admin", "superadmin"), updateProperty);


router.delete("/:id",protect, authorizeRoles("admin", "superadmin"), deleteProperty);

export default router;
