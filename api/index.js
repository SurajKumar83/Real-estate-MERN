import express from "express";
const app = express();
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import cookieParser from "cookie-parser";
import path from "path";

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => console.log(err));

const __dirname=path.resolve();
app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
  console.log("Server is running on the port 3000");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

// for route like '/' join to the build for the client
app.use(express.static(path.join(__dirname,'/client/dist')));

// routes other than specified routes goto 
app.get('*',(req, res) => {
res.sendFile(path.join(__dirname,'client','dist','index.html'));
})

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({ success: false, statusCode, message });
});
