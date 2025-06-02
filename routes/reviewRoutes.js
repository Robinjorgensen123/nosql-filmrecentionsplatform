import express from "express";
import { protect } from "../middleware/auth.js";
import {
  createReview,
  getAllReviews,
  updateReview,
  deleteReview,
  getReviewById,
} from "../controllers/reviewController.js";

const router = express.Router();

router.post("/", protect, createReview);
router.get("/:id", getReviewById);
router.get("/", getAllReviews);
router.put("/:id", protect, updateReview);
router.delete("/:id", protect, deleteReview);
export default router;
