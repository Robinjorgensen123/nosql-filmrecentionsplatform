import express from "express";
import {
  createMovie,
  deleteMovie,
  getAllMovies,
  getMovieById,
  updateMovie,
  getMoviesWithRatings,
  getReviewsForMovie,
} from "../controllers/movieController.js";
import { protect } from "../middleware/auth.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

router.get("/", getAllMovies);
router.get("/ratings", getMoviesWithRatings);
router.get("/:id/reviews", getReviewsForMovie);
router.get("/:id", getMovieById);

//Måste vara inloggad för att skapa, uppdatera, eller tabort
router.post("/", protect, createMovie);

//endast admin får skapa uppdatera, radera
router.put("/:id", protect, isAdmin, updateMovie);
router.delete("/:id", protect, isAdmin, deleteMovie);

export default router;
