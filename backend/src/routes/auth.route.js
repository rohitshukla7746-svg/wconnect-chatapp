import express from "express"
import { isAuthenticated, login, logout, resetPassword, sendResetOtp, sendVerifyOtp, signup, verifyOtp } from "../controllers/auth.controller.js";
import { middlewareAuth } from "../middleware/auth.middleware.js";

const router = express.Router();


router.post("/signup", signup)
router.post("/login", login)
// router.put("/onboarding", protect, onboarding)
router.post("/logout", logout)
router.post("/send-verify-otp",middlewareAuth, sendVerifyOtp)
router.post("/verify-account",middlewareAuth, verifyOtp)
router.get("/is-auth",middlewareAuth, isAuthenticated)
router.post("/send-reset-otp", sendResetOtp)
router.post("/reset-password", resetPassword)

router.get('/me', (req, res) => {
  res.status(200).json({ success: true, users: req.user });
})


export default router