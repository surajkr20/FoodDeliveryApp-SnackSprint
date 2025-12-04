import UploadOnCloudinary from "../utils/cloudinary.js";
import ShopModel from "../models/shop.model.js";
import ItemsModel from "../models/items.model.js";

export const AddItem = async (req, res) => {
  try {
    const userId = req.user?._id
    const { name, category, price, foodtype } = req.body;
    let image;
    if(req.file){
        image = await UploadOnCloudinary(req.file.path);
    }
    const shop = await ShopModel.findOne({owner: req.userId});
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }
    const item = await ItemsModel.create({
        name, category, foodtype, image, shop: shop._id, price
    })
    return res.status(201).json(item);
  } catch (error) {
    console.log("Create Item Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const EditItems = async (req, res) =>{
    try {
        const itemsId = req.params.itemsId;
        const { name, category, price, foodtype } = req.body;
        let image;
        if(req.file){
            image = await UploadOnCloudinary(req.file.path);
        }
        const item = await ItemsModel.findByIdAndUpdate(itemsId, {
            name, category, price, foodtype, image
        }, {new: true})
        if(!item){
            return res.status(400).json({message: `item not found`})
        }
        return res.status(201).json(item);
    } catch (error) {
        console.log("Item Edit Error:", error);
        return res.status(500).json({ message: error.message });
    }
}