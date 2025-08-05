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
const PORT = process.env.PORT || 5000;

// Environment detection
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = !isProduction;

console.log(`Running in ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'} mode`);

const corsOptions = {
    origin: function (origin, callback){
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:3000',
            'https://your-frontend-app.vercel.app',
            'https://your-admin-app.vercel.app'
        ];

        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
};

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
    res.json({
        message: "Food Delivery Backend API is running!",
        environment: isProduction ? 'production' : 'development',
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT,()=>{
    console.log(`Server started on ${isProduction ? 'Production' : 'Local'} - Port: $`);
})

// mongodb+srv://greatstack:33858627@cluster0.e5nmbpl.mongodb.net/?



