import User from "../models/user.model.js";
import dotenv from "dotenv"
import bcrypt from "bcryptjs";
import crypto from "crypto"
import { generateTokenandSetCookie } from "../utils/generateTokenandSetCookie.js";
import { sendResetPasswordEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";

dotenv.config();

export const signup = async (req, res) => {
    const{ email, password, name } = req.body;
    try {
        if(!email || !password || !name){
            throw new Error('Please fill all the fields');
        }   

        const userexist = await User.findOne({email});

        if(userexist){
            return res.status(400).json({success: false, message: 'User already exists'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken: verificationToken,
            verificationExpiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        });

        await user.save();

        // jwt
        generateTokenandSetCookie(user._id, res);

        await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({success: true, message: 'User created successfully', user: {
            ...user._doc,
            password: undefined,
        }});

    } catch (error) {
        res.status(400).json({success: false, message: "Error in Signup contoller " + error});
    }
};

export const verifyemail = async (req, res) => {
    const {code} = req.body;

    try {
        const user = await User.findOne({verificationToken: code,
            verificationExpiresAt: { $gt: Date.now()}
        })

        if(!user){
            return res.status(400).json({message: "Invalid or expire verification Token"});
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationExpiresAt = undefined;
        await user.save();

        await sendWelcomeEmail(user.email, user.name);

        res.status(200).json({message: "Welcome mail send successfully", ok: true,user: {
            ...user._doc,
            password: undefined,
        } })
        
    } catch (error) {
        console.log(error);
        res.status(400).json({success: false, message: error.message});
    }
}

export const login = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({message: "User not found of this email"});
        }

        const pass = await bcrypt.compare(password, user.password);

        if(!pass){
            return res.status(400).json({message: "Password is not correct"});
        }

        generateTokenandSetCookie(user._id, res);
        user.lastLogoin = new Date();

        await user.save();

        res.status(200).json({message: "User login successfully", success: true, user: {
            ...user._doc,
            password: undefined,
        }});

    } catch (error) {
        return res.status(400).json({message: error.message, success: false});
    }
};

export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({success: true, message: "Logged out successfully"})
};

export const forgotpassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found with this email" });
        }

        const resetToken = crypto.randomBytes(20).toString("hex");
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = Date.now() + 3600000; // 1 hour

        await user.save();

        // Send email with reset token
        await sendResetPasswordEmail(user.email,`${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        res.status(200).json({ success: true, message: "Password reset token sent to email" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const resetpassword = async (req, res) => {

    try {
        const {token} = req.params;
        const {password} = req.body;
    
        const user = await User.findOne({resetPasswordToken: token, resetPasswordExpiresAt: { $gt: Date.now()}});

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
        }

        //update password
        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        await sendResetSuccessEmail(user.email);

        res.status(200).json({success: true, message: "Password reset successfully sent email"});

    } catch (error) {
        console.log("Error in sending reset password success email", error);
        res.status(400).json({success: false, message: "Error in sending reset password success email"});       
    }
}

export const checkauth = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if(!user){
            return res.status(400).json({ success: false, message: "User not found"});
        }

        res.status(200).json({success: true, user});
    } catch (error) {
        console.log("Error in checkauth ", error);
        return res.status(400).json({ success: false, message: error.message});
    }
}