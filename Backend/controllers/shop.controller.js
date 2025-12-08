import ShopModel from "../models/shop.model.js";
import UploadOnCloudinary from "../utils/cloudinary.js";

export const CreateOrUpdateShop = async (req, res) => {
  try {
    const userId = req.userId; // coming from isAuth middleware
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { name, city, state, address } = req.body;

    let image;
    if (req.file) {
      const uploaded = await UploadOnCloudinary(req.file.path);
      image = uploaded;
    }

    // find existing shop
    let shop = await ShopModel.findOne({ owner: userId });

    if (!shop) {
      // create new
      shop = await ShopModel.create({
        name,
        city,
        state,
        owner: userId,
        address,
        image,
      });
    } else {
      // update existing
      shop = await ShopModel.findByIdAndUpdate(
        shop._id,
        {
          name,
          city,
          state,
          owner: userId,
          address,
          ...(image && { image }), // only update image if new image uploaded
        },
        { new: true }
      );
    }

    await shop.populate("owner");

    return res.status(201).json(shop);
  } catch (error) {
    console.log("Shop Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getCurrentShop = async (req, res) => {
  try {
    const shop = await ShopModel.findOne({ owner: req.userId }).populate(
      "owner"
    );
    if (!shop) {
      return res.status(404).json({ message: `shop not found` });
    }
    return res.status(200).json(shop);
  } catch (error) {
    console.log("getting current shop Error:", error);
    return res.status(500).json({ message: error.message });
  }
};
