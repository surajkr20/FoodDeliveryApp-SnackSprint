import mongoose from "mongoose";

const ItemsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shop",
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Snacks",
        "Main Course",
        "Desserts",
        "Pizza",
        "Burgers",
        "Sandwiches",
        "South Indian",
        "North Indian",
        "Chinese",
        "Fast Food",
        "Others",
      ],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    foodtype: {
      type: String,
      enum: ["veg", "non veg"],
      required: true,
    },
  },
  { timestamps: true }
);

const ItemsModel = mongoose.model("items", ItemsSchema);
export default ItemsModel;
