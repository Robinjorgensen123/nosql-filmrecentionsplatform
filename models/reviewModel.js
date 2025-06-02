import mongoose from "mongoose";
//varje review "recension" kopplas till en specifik film & en specifik user
//movie id och user id refererar till dokument i Movie samt User-schemas
const reviewSchema = new mongoose.Schema(
  {
    movieId: {
      type: mongoose.Schema.Types.ObjectId, //film id
      ref: "Movie", //refererar till Movie-Schemat
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId, // user id
      ref: "User", // refererar till user schemat
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true, // tar bort mellanslag före och efter
    },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;
