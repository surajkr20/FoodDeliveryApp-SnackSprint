import express from "express";
import { CreateOrUpdateShop, getCurrentShop } from "../controllers/shop.controller.js";
import { isAuth } from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
const shopRouter = express.Router();

shopRouter.post("/create-edit", isAuth, upload.single("image"), CreateOrUpdateShop);
shopRouter.get("/get-shop", isAuth, getCurrentShop);

export default shopRouter;