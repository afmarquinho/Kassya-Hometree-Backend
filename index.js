import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import cors from "cors"

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
const PORT = process.env.PORT || 4000;

dotenv.config();

connectDB();

//CORS CONFIGURATION
const whiteList = [process.env.FRONTEND_URL];
app.use(
    cors({
      origin: whiteList,
    })
  );


app.use("/api/user", userRoutes);

app.listen(PORT, () => console.log(`server running on ${PORT} port`));
