import jwt from 'jsonwebtoken';
import User from '../Models/User.model.js';


const verifyToken = async (req, res, next) => {
    try {
        const authHead = req.headers.authorization;

        if (!authHead || !authHead.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authorization token is missing"
            });
        }

        const token = authHead.split(" ")[1];

        let decoded;

        try {
            decoded = jwt.verify(
                token,
                process.env.SECRET_KEY
            );
        } catch (error) {

            if (error.name === "TokenExpiredError") {
                return res.status(401).json({
                    success: false,
                    message: "Access token is expired"
                });
            }

            return res.status(401).json({
                success: false,
                message: "Invalid access token"
            });
        }

        console.log("DECODED TOKEN:", decoded);

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Important
        req.user = user;
        req.id = user._id;

        console.log("REQ.ID:", req.id);

        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export default verifyToken;


export const isAdmin = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        // req.user already database se aa raha hai
        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Admins only can access"
            });
        }

        next();

    } catch (error) {
        console.log("IS ADMIN ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

