import UserModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import tokenGenerate from "../config/token.js";

export const signup = async (req, res) => {
  try {
    const { fullname, email, password, mobile, role } = req.body;
    const userExist = await UserModel.findOne({ email });
    if (userExist) return res.status(400).json({ message: "user already exists!" });
    if (password.length < 6)
      return res
        .status(400)
        .json({ message: "password must be atleast 6 characters" });
    if (mobile.length < 10)
      return res
        .status(400)
        .json({ message: "mobile number must be atleast 10 digits" });
    const hashedpassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      fullname,
      email,
      password: hashedpassword,
      mobile,
      role,
    });
    const token = await tokenGenerate(user._id);
    res.cookie("token", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: false,
    });

    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json(`signup error ${error}`);
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({
          message:
            "user with this email does not exist in our database, please register!",
        });
    const matchedPassword = await bcrypt.compare(password, user.password);
    if (!matchedPassword)
      return res.status(400).json({ message: "invalid email or password" });
    const token = await tokenGenerate(user._id);
    res.cookie("token", token, {
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
    });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json(`signin error ${error}`);
  }
};

export const signout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "sign out successfully" });
  } catch (error) {
    return res.status(500).json({ message: `sign out error ${error}` });
  }
};
