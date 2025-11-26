import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.GMAIL,
    pass: process.env.APP_PASSWORD,
  }
});

export const SendOtpMail = async (to, otp) =>{
  await transporter.sendMail({
    from: process.env.GMAIL,
    to,
    subject: "Reset Your Password",
    html: `<p>Your OTP for password reset is <b>${otp}</b>, It expires in 5 minutes.</p>`
  })
}