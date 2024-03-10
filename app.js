import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import authRouter from "./route/authRoute.js";

const app = express();
const PORT =3000;

dotenv.config();
app.use(cors());
app.use(express.json());

const db = mongoose.connect(process.env.DB_URL).then(()=>{
    console.log("Database connected");

}).catch((error)=>{
    console.log("Error", error);
});

app.use("/api/v1/auth", authRouter);


app.listen(PORT, ()=>{
    console.log(`Server is running on port http://localhost:${PORT}`);
})