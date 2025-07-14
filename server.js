import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./Routes/foodRoute.js";
import userRouter from "./Routes/userRoute.js";
import 'dotenv/config';

// app config
const app = express();
const PORT = 5000;

//middleware
app.use(express.json());
app.use(cors());

//This is used to access the backend from frontend

// db connection
connectDB();

// api endpoints
app.use("/api/food",foodRouter);
app.use("/images", express.static('Uploads'));
app.use("/api/user", userRouter);

// to request the data from the server
app.get("/", (req,res)=>{
    res.send("Backend is working");
});

app.listen(PORT,()=>{
    console.log(`Server started on http://localhost:${PORT}`);
})

// mongodb+srv://greatstack:33858627@cluster0.e5nmbpl.mongodb.net/?



