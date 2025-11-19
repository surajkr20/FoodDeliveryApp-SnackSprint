import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        uniue: true
    },
    password: {
        type: String,
    },
    mobile: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "owner", "deliveryboy"],
        required: true
    }
}, {timestamps: true})

const UserModel = mongoose.model("user", UserSchema);
export default UserModel;