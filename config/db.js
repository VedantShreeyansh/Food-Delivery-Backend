import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://greatstack:33858627@cluster0.e5nmbpl.mongodb.net/');
        console.log("DB Connected");
    } catch (error) {
        console.log("DB Connection Error:", error);
        process.exit(1);
    }
}

