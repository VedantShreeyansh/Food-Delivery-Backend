import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./Routes/foodRoute.js";
import userRouter from "./Routes/userRoute.js";
import cartRouter from "./Routes/cartRoute.js";
import orderRouter from "./Routes/orderRoute.js";
import 'dotenv/config';

// Debug: Check if environment variables are loaded
console.log("Environment variables loaded:");
console.log("JWT_SECRET:", process.env.JWT_SECRET);
console.log("STRIPE_SECRET_KEY exists:", !!process.env.STRIPE_SECRET_KEY);
console.log("STRIPE_SECRET_KEY value:", process.env.STRIPE_SECRET_KEY);

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
app.use("/api/cart", cartRouter);
app.use("/api/order",orderRouter);

// app._router.stack.forEach(function(r){
//   if (r.route && r.route.path){
//     console.log(`Route: ${Object.keys(r.route.methods)} ${r.route.path}`);
//   }
// });

// to request the data from the server
app.get("/", (req,res)=>{
    res.send("Backend is working");
});

app.listen(PORT,()=>{
    console.log(`Server started on http://localhost:${PORT}`);
})

// mongodb+srv://greatstack:33858627@cluster0.e5nmbpl.mongodb.net/?



