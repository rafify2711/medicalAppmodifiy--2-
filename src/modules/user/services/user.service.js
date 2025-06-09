import jwt from "jsonwebtoken";
import userModel from "../../../DB/model/User.model.js";
import Reservation from "../../../DB/model/reservation.model.js";
import CryptoJS from "crypto-js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import { roleTypes } from "../../../middleware/auth.middleware.js";
import { authorization } from "../../../middleware/auth.middleware.js";
// import messageModel from "../../../DB/model/message.model.js";

export const getAllUsers = async () => {
    return await userModel.find();
  };
  
  export const getUserById = async (userId) => {
    return await userModel.findById(userId).populate("reservationHistory");
  };
  
  export const createUser = async (userData) => {
    return await userModel.create(userData);
  };



// get user profile
  export const profile = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization?.startsWith("Bearer ")) {
            return res.status(400).json({ message: "Invalid token format" });
        }

        const token = authorization.split(" ")[1]; // Extract token
        const decoded = jwt.verify(token, process.env.TOKEN_SIGNATURE);

        // Fetch user using ID from decoded token
        const user = await userModel.findById(decoded.id).select("-password"); // Exclude password for security
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Decrypt phone number if it exists
        if (user.phone) {
            user.phone = CryptoJS.AES.decrypt(user.phone, process.env.ENCRYPTION_SIGNATURE).toString(CryptoJS.enc.Utf8);
        }

        return res.status(200).json({ message: "User profile", user });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};


// export const profile= async (req, res, next)=>{
//     try {
//         return res.status(200).json({message:"Done", user:req.user})
//     } catch (error) {
//         return res.status(500).json({message:"server error", error,msg:error.message,stacK:error.stack})

//     }
// }

export const shareProfile= async (req, res, next)=>{
    try {
        const user = await userModel.findOne({_id:req.params.userId, isDeleted:false}).select("username email profilePhoto ")
        return user? res.status(200).json({message:"Done"}): res.status(400).json({message:"In-valid accont ID"})


    } catch (error) {
        return res.status(500).json({message:"server error", error,msg:error.message,stacK:error.stack})

    }
}

// update user Profile 


export const updateProfile = async (req, res, next) => {
    try {
        let updateData = { ...req.body };

        // Encrypt phone if it's being updated
        if (updateData.phone) {
            updateData.phone = CryptoJS.AES.encrypt(
                updateData.phone,
                process.env.ENCRYPTION_SIGNATURE
            ).toString();
        }

        // Update user
        const user = await userModel.findByIdAndUpdate(
            req.user._id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Decrypt phone before sending it back
        if (user.phone) {
            user.phone = CryptoJS.AES.decrypt(user.phone, process.env.ENCRYPTION_SIGNATURE).toString(CryptoJS.enc.Utf8);
        }

        return res.status(200).json({ message: "Profile updated successfully", user });

    } catch (error) {
        return res.status(500).json({ 
            message: "Server error", 
            error: error.message,
            stack: error.stack
        });
    }
};

//update profile image 
export const updateProfileImage = async (req, res) => {
    const userId = req.user._id;
    
    if (!req.file) {
        return res.status(400).json({ message: 'No image file uploaded' });
    }

    try {
        // Create the full URL for Back4App
        const serverUrl = 'https://medicalapp-sku9qeo9.b4a.run';
        const imageUrl = `${serverUrl}/files/${req.file.filename}`;
        
        // Update user with the full image URL
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { profileImage: imageUrl },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ 
            message: 'Profile image updated successfully', 
            user: updatedUser,
            imageUrl: imageUrl 
        });
    } catch (err) {
        res.status(500).json({ 
            message: 'Error updating profile image', 
            error: err.message 
        });
    }
};



export const updatePassword = async (req, res, next) => {
    try {
        const { password, oldPassword } = req.body;

        // Retrieve user from database
        const user = await userModel.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare old password with stored hash
        const isMatch = bcrypt.compareSync(oldPassword, user.password);
        if (!isMatch) {
            return res.status(409).json({ message: "Invalid old password" });
        }

        // Hash new password
        const hashedPassword = bcrypt.hashSync(password, 10); // 10 is salt rounds

        // Update password and timestamp
        const updatedUser = await userModel.findByIdAndUpdate(
            req.user._id,
            { password: hashedPassword, changePasswordTime: Date.now() },
            { new: true, runValidators: true }
        );

        return res.status(200).json({ message: "Password updated successfully", user: updatedUser });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
            stack: error.stack,
        });
    }
};

export const freezeProfile= async (req, res, next)=>{
    try {
        async (req, res, next)=>{
       
            const user = await userModel.findByIdAndUpdate(req.user._id,{password:hashPassword},{changePasswordTime:Date.now()},{new:true, runValidators:true})
            return res.status(200).json({message:"Done", user:req.user})

        }
    } catch (error) {
        return res.status(500).json({message:"server error", error,msg:error.message,stacK:error.stack})

    }
}


  //get all user's reservations 

export const getAllUserReservations = async (req, res) => {
    try {
        const { userId } = req.params;

        // Validate userId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        // Fetch all reservations for the given user
        const reservations = await Reservation.find({ user: userId })
            .populate("doctor", "username specialty") // Populate doctor details
            .populate("user", "username email"); // Populate user details

      

        // Modify response to include doctor details directly
        const formattedReservations = reservations.map(reservation => ({
            id: reservation._id,
            date: reservation.date,
            timeSlot:reservation.timeSlot,
            status: reservation.status,
            doctor: {
                id: reservation.doctor._id,
                name: reservation.doctor.username,
                specialization: reservation.doctor.specialty
            },
            user: {
                id: reservation.user._id,
                username: reservation.user.username,
                email: reservation.user.email
            }
        }));

        return res.status(200).json({ 
            message: "Reservations fetched successfully", 
            reservations: formattedReservations
        });

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};
