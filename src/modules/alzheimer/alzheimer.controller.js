import { Router } from "express";
import axios from "axios";
import FormData from "form-data";
import multer from "multer";
import fs from "fs";
import path from "path";

const router = Router();
const upload = multer({ dest: "uploads/" }); // ✅ Store uploaded files in 'uploads/'

router.post("/predict", upload.single("file"), async (req, res) => {
    try {
        console.log("🟢 Incoming file:", req.file);

        if (!req.file) {
            return res.status(400).json({ error: "❌ No file uploaded" });
        }

        const filePath = req.file.path; // ✅ Get temporary file path

        // ✅ Prepare the file for multipart upload
        const formData = new FormData();
        formData.append("file", fs.createReadStream(filePath), req.file.originalname);

        // ✅ Make the FastAPI request for Kidney Stone Prediction
        const response = await axios.post("http://127.0.0.1:8000/predict/alzheimer/", formData, {
            headers: {
                ...formData.getHeaders(), // ✅ Set correct headers for multipart
            },
        });

        console.log("✅ alzheimer Prediction received:", response.data);
        res.json({ success: true, prediction: response.data });

        // ✅ Cleanup: Remove uploaded file after processing
        fs.unlink(filePath, (err) => {
            if (err) console.error("⚠️ Error deleting file:", err);
        });
    } catch (error) {
        console.error("❌ alzheimer Prediction Error:", error);
        res.status(500).json({
            error: "Failed to get prediction",
            details: error.response ? error.response.data : error.message,
        });
    }
});

export default router;