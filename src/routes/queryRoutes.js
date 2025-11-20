import express from "express";
import {
  createQuery,
  getAllQueries,
  getQueryById,
  updateQuery,
  deleteQuery,
  getQueryCount,
} from "../controller/queryController.js";

const router = express.Router();

router.post("/create", createQuery); 
router.get("/fetch", getAllQueries); 
router.get("/fetch/:id", getQueryById); 
router.put("/update/:id", updateQuery);
router.delete("/delete/:id", deleteQuery);
router.get("/count", getQueryCount);

export default router;
