import express from "express";
const app = express();
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => console.log(err));

app.use(express.json());

app.listen(3000, () => {
  console.log("Server is running on the port 3000");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
