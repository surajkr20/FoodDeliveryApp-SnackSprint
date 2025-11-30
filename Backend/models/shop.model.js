import mongoose from "mongoose";

const ShopSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    pincode: {
        type: Number,
        required: true
    },
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ItemsModel"
    }]
}, {timestamps: true})

const ShopModel = mongoose.model("shop", ShopSchema);
export default ShopModel;