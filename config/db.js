import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Ansluten till MongoDB")
    } catch (err) {
        console.error("Fel vid anslutning till databasen MongoDB", err.message)
        process.exit(1)
    }
}

export default connectDB