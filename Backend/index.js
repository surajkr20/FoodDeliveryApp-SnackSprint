import dotenv from "dotenv";
dotenv.config();
import dbConnect from "./config/db.js";
import express from "express";
import UserModel from "./models/user.model.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import cors from "cors";
const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRouter);

app.listen(port, () => {
  dbConnect();
  console.log(`server started at port ${port}`);
});
