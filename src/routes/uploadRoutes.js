import express from "express";
import multer from "multer";
import { uploadImagesToS3, getAllS3Images,getMapBySlug,  uploadYamunaMaps,
  getAllYamunaMaps,
  getYamunaMapBySlug } from "../controller/upload-controller.js";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/new", upload.array("images", 10), uploadImagesToS3);

router.get("/maps/:slug", getMapBySlug);
router.get("/maps", getAllS3Images);


router.post("/yamuna/new", upload.array("images", 10), uploadYamunaMaps);
router.get("/yamuna/maps", getAllYamunaMaps);
router.get("/yamuna/maps/:slug", getYamunaMapBySlug);


export default router;
 