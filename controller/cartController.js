import UserModel from "../models/userModel.js";
import cartRouter from "../Routes/cartRoute.js";

// add items to your cart
const addToCart = async (req, res) => {
  try {
    let userData = await UserModel.findById(req.body.userId);
    let cartData = await userData.cartData;

    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }
    await UserModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.json({ success: true, message: "Added To Cart" });
  } catch (error) {  
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// remove items from user cart
const removeFromCart = async (req, res) => {
  try {
    let userData = await UserModel.findById(req.body.userId);
    let cartData = await userData.cartData;
    if (cartData[req.body.itemId]>0){
        cartData[req.body.itemId] -= 1;
    }
    await UserModel.findByIdAndUpdate(req.body.userId, {cartData});
    res.json({success:true, message: "Removed from the Cart"});
  }
  catch (error) {
    console.log(error);
    res.json({success: false, message: "Error"});
  }
};

// fetch user cart data
const getCart = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("User ID:", req.body.userId);
    
    let userData = await UserModel.findById(req.body.userId);
    console.log("User data:", userData);
    
    let cartData = await userData.cartData;
    console.log("Cart data:", cartData);
    
    res.json({success: true, cartData})
  } catch (error) {
    console.log("Detailed error:", error);
    res.json({success:false, message: "Error"});
  }
};

export { addToCart, removeFromCart, getCart };
