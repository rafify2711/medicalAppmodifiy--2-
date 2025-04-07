
import userModel from "../DB/model/User.model.js";
import Doctor from "../DB/model/doctor.model.js";
import jwt from "jsonwebtoken";

export const roleTypes = {
    user: "User",
    admin: "Admin",
    doctor: "Doctor",
};

export const authentication = () => {
    return async (req, res, next) => {
        try {
            const { authorization } = req.headers;
            console.log({ authorization });

            if (!authorization) {
                return res.status(400).json({ message: "Authorization is required" });
            }

            const [Bearer, token] = authorization.split(" ");
            console.log({ Bearer, token });

            if (!Bearer || !token) {
                return res.status(400).json({ message: "Invalid token components" });
            }

            let signature;
            switch (Bearer) {
                case "Bearer":
                    signature = process.env.TOKEN_SIGNATURE;
                    break;
                case "admin":
                    signature = process.env.TOKEN_SIGNATURE_ADMIN;
                    break;
               
                default:
                    return res.status(400).json({ message: "Invalid token type" });
            }

            const decoded = jwt.verify(token, signature);
            console.log({ decoded });

            if (!decoded?.id) {
                return res.status(400).json({ message: "Invalid token payload" });
            }

            // Check if user exists in the User model
            let account = await userModel.findById(decoded.id);
            let role = roleTypes.user;

            // If not found in User model, check in Doctor model
            if (!account) {
                account = await Doctor.findById(decoded.id);
                role = roleTypes.doctor;
            }

            console.log({ account });

            if (!account) {
                return res.status(404).json({ message: "Not a registered account" });
            }

            // Check password change time
            if (account.changePasswordTime?.getTime() >= decoded.iat * 1000) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            req.user = { ...account.toObject(), role }; // Include role in req.user
            return next();
        } catch (error) {
            console.error("Authentication Error:", error);
            return res.status(500).json({ 
                message: "Internal server error", 
                error: error?.message || "Unknown error", 
                stack: error?.stack || "No stack trace"
            });
        }
    };
};

export const authorization = (accessRoles = []) => {
    return async (req, res, next) => {
        try {
            console.log({
                accessRoles,
                user: req.user?.role,
                match: accessRoles.includes(req.user?.role),
            });

            if (!req.user || !accessRoles.includes(req.user.role)) {
                return res.status(403).json({ message: "Not authorized account" });
            }

            return next();
        } catch (error) {
            console.error("Authorization Error:", error);
            return res.status(500).json({ 
                message: "Internal server error", 
                error: error?.message || "Unknown error", 
                stack: error?.stack || "No stack trace"
            });
        }
    };
};

export const authenticateUser = async (req, res, next) => {
    try {
      const authHeader = req.headers['authorization'];
  
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
      }
  
      const token = authHeader.split(' ')[1]; 
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
  
      next();
    } catch (error) {
      console.error('Authentication Error:', error);
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
  