import express from "express";
import dotenv from "dotenv";
import userRouter from "./routes/userRoutes.js";
import movieRouter from "./routes/movieRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";
import connectDB from "./config/db.js";

dotenv.config();
connectDB(); // ansluter till mongoDB

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use("/api/users", userRouter);
app.use("/api/movies", movieRouter);
app.use("/api/reviews", reviewRouter);

app.listen(PORT, () => {
  console.log(`servern körs på http://localhost:${PORT}`);
});
