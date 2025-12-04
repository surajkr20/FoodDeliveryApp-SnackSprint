import express from "express";
import { AddItem, EditItems } from "../controllers/item.controller.js";
import {isAuth} from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
const ItemsRouter = express.Router();

ItemsRouter.post("/create-item", isAuth, upload.single("image"), AddItem);
ItemsRouter.post("/update-item/:itemId", isAuth, upload.single("image"), EditItems);

export default ItemsRouter;