import foodModel from "../models/foodModel.js";
import fs from "fs";

// add food item
const addFood = async (req, res) => {
  try {
    if (!req.file) {
      return res.json({ success: false, message: "No image file uploaded" });
    }

    let image_filename = `${req.file.filename}`;

    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: image_filename,
    });

    await food.save();
    res.json({ success: true, message: "Food Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Not found" });
  }
};

const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error });
  }
};

// remove food item
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    fs.unlink(`Uploads/${food.image}`, () => {});

    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Check against any Existing Food Item
const existingFood = async (req, res) => {
  try {
    const food = await foodModel.findOne({ name: req.body.name });
    res.json({ success: true, data: food });
  }
  catch (err) {
    console.log(err);
    res.json({ success: false, message: err});
  }
}

export { addFood, listFood, removeFood, existingFood };
