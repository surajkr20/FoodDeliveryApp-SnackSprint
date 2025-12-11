import express from "express";
import { AddItem, DeleteItem, EditItems, getItems } from "../controllers/item.controller.js";
import {isAuth} from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
const ItemsRouter = express.Router();

ItemsRouter.post("/create-item", isAuth, upload.single("image"), AddItem);
ItemsRouter.post("/update-item/:itemId", isAuth, upload.single("image"), EditItems);
ItemsRouter.get("/get-item/:itemId", getItems);
ItemsRouter.get("/delete-item/:itemId", isAuth, DeleteItem);

export default ItemsRouter;