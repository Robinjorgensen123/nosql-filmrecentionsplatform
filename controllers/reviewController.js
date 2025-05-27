import Review from "../models/reviewModel.js";

export const createReview = async (req, res) => {
  const { rating, comment, movieId } = req.body;
  const userId = req.user.id;

  if (!rating || !movieId) {
    return res.status(400).json({
      message: "rating & movieId måste vara med i body",
      details: "Både rating och movieId krävs",
      success: false,
    });
  }

  try {
    const newReview = new Review({
      movieId,
      userId,
      rating,
      comment,
    });

    await newReview.save();

    return res.status(201).json({
      message: "Recension skapad",
      success: true,
      review: newReview,
    });
  } catch (err) {
    console.error("Fel i createReview:", err.message);
    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "valideringsfel",
        details: err.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: "ett oväntat fel uppstod",
      details: err.message,
    });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("movieId", "title releaseYear") // väljer movieId objektet och sen plockar vi ut title och releaseYear
      .populate("userId", "username email"); // samma här hämtar ut username & email ifrån userId Objektet

    res.status(200).json({
      success: true,
      message: "Alla recensioner hämtade",
      reviews,
    });
  } catch (err) {
    console.error("Fel i getAllReviews", err.message);
    res.status(500).json({
      success: false,
      message: "Kunde inte hämta recensioner",
      details: err.message,
    });
  }
};

export const getReviewById = async (req, res) => {
  const reviewId = req.params.id;

  try {
    const review = await Review.findById(reviewId)
      .populate("movieId", "title releaseYear") // visa vem som skrev recentionen
      .populate("userId", "username email");

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Recensionen för filmen hittades inte",
      });
    }
    res.status(200).json({
      success: true,
      message: "Recension för filmen hämtade",
      review,
    });
  } catch (err) {
    console.error("fel i getReviewById:", err.message);
    res.status(500).json({
      success: false,
      message: "Kunde inte hömta recensioner för filmen",
      details: err.message,
    });
  }
};

export const updateReview = async (req, res) => {
  const reviewId = req.params.id;
  const userId = req.user.id;
  const { rating, comment } = req.body;

  try {
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Recensionen hittades inte",
      });
    }
    // Endast den som skapade recensionen får uppdatera
    if (review.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Du har inte behörighet att uppdatera recensionen",
      });
    }
    // Uppdatera fält om de finns i req.body skickar man inget i body så skrivs inte gamla värdet över.
    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;

    const updateReview = await review.save();

    res.status(200).json({
      success: true,
      message: "Recension uppdaterad",
      review: updateReview,
    });
  } catch (err) {
    console.error("Fel i uppdateReview", err.message);
    res.status(500).json({
      success: false,
      message: "kunde inte uppdatera recension",
      details: err.message,
    });
  }
};

export const deleteReview = async (req,res) => {
    const reviewId = req.params.id
    const userId = req.user.id

    try {
        const review = await Review.findById(reviewId)

        if (!review) {
            return res.status({
                success: false,
                message: "Recension hittades ej"
            })
        }

        if (review.userId.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message:"Du har inte behörighet att ta bort denna recension"
            })
        }
        await review.deleteOne()

        res.status(200).json({
            success: true,
            message: "Recension borttagen"
        })
    } catch (err) {
        console.error("Fel i deleteReview:", err.message)
        res.status(500).json({
            success: false,
            message:"Kunde inte ta bort recension",
            details: err.message
        })
    }
}