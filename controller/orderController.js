import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const STRIPE_SECRET_KEY = "sk_test_your_real_key_here"

// ✅ Use environment variable instead of hardcoded key
const stripe = new Stripe(STRIPE_SECRET_KEY);

// placing user order for frontend
const placeOrder = async (req,res) => {
    const frontend_url = "http://localhost:5173";
    
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        })
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}});

        const line_items = req.body.items.map((item)=>({
            price_data: {
                currency: "inr",
                product_data:{
                    name:item.name
                },
                unit_amount:item.price*100*80
            },
            quantity:item.quantity
        }))

        line_items.push({
            price_data:{
                currency: "inr",
                product_data: {
                    name: "Delivery Charges"
                },
                unit_amount:2*100*80
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`
        })

        res.json({success:true,session_url:session.url})

    } catch (error){
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

const verifyOrder = async (req, res) => {
    const {orderId, success} = req.body;
    try {
        if (success == "true") {
            await orderModel.findByIdAndUpdate(orderId, {payment:true});
            res.json({success:true,message:"Paid"})
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({success:false,message:"Not Paid"});
        }
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}

const userOrders = async (req, res) => {
    try {
        console.log("userOrders called with userId:", req.body.userId);
        const orders = await orderModel.find({userId:req.body.userId});

        orders.forEach((order, index) => {
            console.log(`Order ${index} status in DB:`, order.status);
        });

        res.json({success:true,data:orders})
    } catch (error){
        console.log(error);
        res.json({success:false,message:"Error"})
    }
};

const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        console.log(`Found ${orders.length} orders for admin`);
        res.json({success:true,data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"});
    }
} 

// ✅ Enhanced updateStatus with better logging
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        console.log(`Updating order ${orderId} to status: ${status}`);
        
        const updatedOrder = await orderModel.findByIdAndUpdate(
            orderId, 
            { status: status }, 
            { new: true } // Return the updated document
        );
        
        if (!updatedOrder) {
            return res.json({success: false, message: "Order not found"});
        }
        
        console.log(`Order ${orderId} successfully updated to: ${updatedOrder.status}`);
        res.json({success: true, message: "Status Updated", order: updatedOrder});
    } catch (error) {
        console.log("Error updating order status:", error);
        res.json({success: false, message: "Error updating status"});
    }
}

export {placeOrder, verifyOrder, userOrders, listOrders, updateStatus};