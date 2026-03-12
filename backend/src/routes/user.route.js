import express from "express";
import { middlewareAuth } from "../middleware/auth.middleware.js";
import { getUserData, updateProfile, updateAvatar, getAllUsers, changePassword } from "../controllers/user.controller.js";
import { upload } from "../lib/cloudinary.js";

const router = express.Router();

router.get("/data", middlewareAuth, getUserData);
router.get("/all", middlewareAuth, getAllUsers);
router.put("/update", middlewareAuth, updateProfile);
router.put("/avatar", middlewareAuth, upload.single("avatar"), updateAvatar);
router.put("/change-password", middlewareAuth, changePassword);

export default router;
