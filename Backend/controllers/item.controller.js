import UploadOnCloudinary from "../utils/cloudinary.js";
import ShopModel from "../models/shop.model.js";
import ItemsModel from "../models/items.model.js";

export const AddItem = async (req, res) => {
  try {
    const { name, category, price, foodtype } = req.body;
    let image;
    if (req.file) {
      image = await UploadOnCloudinary(req.file.path);
    }
    const shop = await ShopModel.findOne({ owner: req.userId });
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }
    const item = await ItemsModel.create({
      name,
      category,
      foodtype,
      image,
      shop: shop._id,
      price,
    });

    shop.items.push(item._id);
    await shop.save();
    await shop.populate("items owner");

    return res.status(201).json(shop);
  } catch (error) {
    console.log("Create Item Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const EditItems = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    if (!itemId) {
      return res.status(400).json({ message: `itemId not found` });
    }
    const { name, category, price, foodtype } = req.body;
    let image;
    if (req.file) {
      image = await UploadOnCloudinary(req.file.path);
    }
    const item = await ItemsModel.findByIdAndUpdate(
      itemId,
      {
        name,
        category,
        price,
        foodtype,
        image,
      },
      { new: true }
    );
    if (!item) {
      return res.status(400).json({ message: `item not found` });
    }
    const shop = await ShopModel.findOne({ owner: req.userId }).populate(
      "items"
    );
    return res.status(201).json(shop);
  } catch (error) {
    console.log("Item Edit Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getItems = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    if (!itemId) {
      return res.status(400).json({ message: `itemId not found` });
    }
    const items = await ItemsModel.findById(itemId);
    if (!items) {
      return res.status(400).json({ message: `items not found` });
    }
    return res.status(200).json(items);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `getting current items error`, error });
  }
};

export const DeleteItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    if (!itemId) {
      return res.status(400).json({ message: `itemId not found` });
    }
    const item = await ItemsModel.findByIdAndDelete(itemId);
    if (!item) {
      return res.status(400).json({ message: `items not found` });
    }
    const shop = await ShopModel.findOne({ owner: req.userId });
    shop.items = shop.items.filter((i) => i !== item._id);
    await shop.save();
    await shop.populate({
      path: "items",
      options: { sort: { updatedAt: -1 } },
    });
    return res.status(200).json(shop);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `error in the deleting food items`, error });
  }
};
