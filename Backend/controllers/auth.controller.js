import UserModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import tokenGenerate from "../utils/token.js";
import { SendOtpMail } from "../utils/mail.js";

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

export const SendOtp = async (req, res) =>{
  try {
    const {email} = req.body;
    const userExist = await UserModel.findOne({email});
    if(!userExist) return res.status(400).json({message: "user is not exist, please enter your valid Email"});
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    userExist.resetOtp = otp;
    userExist.otpExpires = Date.now() + 5 * 60 * 1000;
    userExist.isOtpVerified = false;
    await userExist.save();
    await SendOtpMail(email, otp);
    return res.status(200).json({message: "otp sent successfully"})
  } catch (error) {
    return res.status(500).json({message: `otp send error ${error}`})
  }
}

export const verifyOtp = async (req, res) =>{
  try {
    const {email, otp} = req.body;
    const currentUser = await UserModel.findOne({email});
    if(!currentUser || currentUser.resetOtp != otp || currentUser.otpExpires < Date.now()) 
      return res.status(400).json({message: "Invalid or Expired Otp"})
    currentUser.resetOtp = undefined;
    currentUser.isOtpVerified = true;
    await currentUser.save();
    return res.status(200).json({message: "otp verified successfully"})
  } catch (error) {
    return res.status(500).json({message: `otp verify error ${error}`})
  }
}

export const resetPassword = async (req, res) =>{
  try {
    const {email, newPassword} = req.body;
    const user = await UserModel.findOne({email});
    if(!user || !user.isOtpVerified) return res.status(400).json({message: "otp verification required"});
    if(newPassword.length < 6) return res.status(400).json({message: "password must be atleast 6 characters"});
    const hashedpassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedpassword;
    user.isOtpVerified = false;
    await user.save();
    return res.status(200).json({message: "your password changed successfully"})
  } catch (error) {
    return res.status(500).json({message: `reset password error ${error}`})
  }
}