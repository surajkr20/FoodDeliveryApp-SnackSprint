import express from "express";
import { CreateOrUpdateShop } from "../controllers/shop.controller.js";
import { isAuth } from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
const shopRouter = express.Router();

shopRouter.post("/create-edit", isAuth, upload.single("image"), CreateOrUpdateShop);

export default shopRouter;