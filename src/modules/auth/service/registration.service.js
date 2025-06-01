import userModel from "../../../DB/model/User.model.js";
import Doctor from "../../../DB/model/doctor.model.js";
import bcrypt from 'bcryptjs';  // تم التعديل هنا
import jwt from "jsonwebtoken";
import { roleTypes } from "../../../middleware/auth.middleware.js";

export const signup = async (req, res, next) => {
  try {
    const { username, email, password, confirmationPassword, phone, role, specialty } = req.body;

    console.log({ username, email, password, confirmationPassword, role, specialty });

    //  Validate passwords match
    if (password !== confirmationPassword) {
      return res.status(400).json({ message: "Password and confirmationPassword do not match" });
    }

    //  Check if email already exists in both User and Doctor collections
    const existingUser = await userModel.findOne({ email });
    const existingDoctor = await Doctor.findOne({ email });

    if (existingUser || existingDoctor) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Hash password
    const hashPassword = bcrypt.hashSync(password, parseInt(process.env.SALT_ROUND));

    // Encrypt phone number if needed (Uncomment if you plan to use it)
    // const encryptPhone = CryptoJS.AES.encrypt(phone, process.env.ENCRYPTION_SIGNATURE).toString();

    let newUser;

    //  Check role and save to correct collection
    if (role === "Doctor") {
      if (!specialty) {
        return res.status(400).json({ message: "Specialty is required for doctors" });
      }
      newUser = await Doctor.create({
        username,
        email,
        password: hashPassword,
        // phone: encryptPhone, // Uncomment if you are using encryption
        specialty,
      });
    } else {
      newUser = await userModel.create({
        username,
        email,
        password: hashPassword,
        // phone: encryptPhone, // Uncomment if you are using encryption
        role: "User", // Ensure default role
      });
    }

    res.status(201).json({ message: "Signup successful", user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res, next) => {
  try {
    console.log("Login request received");
    const { email, password } = req.body;

    let user = await userModel.findOne({ email });
    let role = "User";

    if (!user) {
      user = await Doctor.findOne({ email });
      role = "Doctor";
    }

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "Invalid Account" });
    }

    // Validate password
    const match = bcrypt.compareSync(password, user.password);
    if (!match) {
      console.log("Password mismatch");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Log user ID to ensure it's correct
    console.log("User ID:", user._id);

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id.toString(), role, isLoggedIn: true },
      process.env.TOKEN_SIGNATURE,
      { expiresIn: "24h" }  // يمكنك تعديل مدة الصلاحية إذا رغبت
    );

    console.log("Token generated:", token);
    return res.status(200).json({ message: "Login successful", userId: user._id, role, token });

  } catch (error) {
    console.error("Error in login:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};
