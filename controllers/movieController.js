import Movie from "../models/movieModel.js";
import Review from "../models/reviewModel.js";

export const createMovie = async (req, res) => {
  const { title, director, releaseYear, genre } = req.body;

  if (!title || !director || !releaseYear || !genre) {
    return res.status(400).json({
      message: "Alla fält måste fyllas i",
      success: false,
    });
  }

  try {
    const movie = new Movie({ title, director, releaseYear, genre });
    await movie.save();
    return res.status(201).json({
      message: "Film skapad",
      success: true,
      movie,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Kunde inte skapa film",
      success: false,
    });
  }
};

export const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    return res.status(200).json({
      message: "Lyckades hämta alla filmer",
      success: true,
      movies,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Kunde inte hämta filmer",
      success: false,
    });
  }
};

export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie)
      return res.status(404).json({
        message: "Filmen hittades inte",
        success: false,
      });
    return res.status(200).json({
      message: "Filmen hämtades",
      success: true,
      movie,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Kunde inte hämta film", success: false });
  }
};

export const updateMovie = async (req, res) => {
  try {
    const updated = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated)
      return res.status(404).json({
        message: "Filmen hittades inte",
        success: false,
      });
    return res.status(200).json({
      message: "Film uppdaterad",
      success: true,
      movie: updated,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Kunde inte uppdatera filmen",
      success: false,
    });
  }
};

export const deleteMovie = async (req, res) => {
  try {
    const deleted = await Movie.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({
        message: "Filmen hittades inte",
        success: false,
      });
    return res.status(200).json({
      message: "Filmen borttagen",
      success: true,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Kunde inte ta bort film", success: false });
  }
};

export const getMoviesWithRatings = async (req, res) => {
  try {
    const ratings = await Review.aggregate([ // aggregate - Bearbetar/beräknar/grupperar data direkt i databasen"
      {
        $group: { // Grupperar alla recensioner efter movieId, räknar ut snitt avg & total sum
          _id: "$movieId",
          averageRating: { $avg: "$rating" }, // räknar ut snittbetyg
          numberOfReviews: { $sum: 1 }, // räknar antal recensioner
        },
      },
      {
        $lookup: { //"lookup" JOINAR in filmdata från movies kollektionen
          from: "movies", // Hämta filmdata från Movie kollektionen
          localField: "_id", // Matcha id från group (movieId)
          foreignField: "_id", // jämför med filmens _id
          as: "movie", //placerar resultatet i fältet "movie"
        },
      },
      { $unwind: "$movie" }, // vi får en array från lookup, gör om den till ett objekt i movie
      {
        $project: { // väljer vilka fält som ska visas
          _id: 0, // dölj _id från group
          movieId: "$movie._id", // visa filmens id
          title: "$movie.title", // visa filmens tittel
          genre: "$movie.genre", // visa filmens genre
          averageRating: { $round: ["$averageRating", 1] }, // avrunda till 1 decimal
          numberOfReviews: 1 // visa antal recensioner
        },
      },
    ]);
    res.status(200).json({
      success: true,
      message: "Filmer med genomsnittliga reviews hämtade",
      ratings, // går allt bra returneras ratings till klient
    });
  } catch (err) {
    console.error("fel i getMoviesWithRatings:", err.message);
    res.status(500).json({
      success: false,
      message: "kunde inte hämta ratings",
      details: err.message,
    });
  }
};
