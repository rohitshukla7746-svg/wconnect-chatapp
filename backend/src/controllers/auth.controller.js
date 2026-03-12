import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../lib/db.js";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
  maxAge: 30 * 24 * 60 * 60 * 1000
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// ================= SIGNUP =================
export async function signup(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await pool.query(
      "SELECT * FROM users1 WHERE email = $1",
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      "INSERT INTO users1 (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword]
    );

    const token = generateToken(newUser.rows[0].id);

    res.cookie("token", token, cookieOptions);

    // sending welcome email (don't block signup if email fails)
    try {
      // await sgMail.send({
      //   from: process.env.SENDER_EMAIL,
      //   to: email,
      //   subject: "Welcome to Wconnect",
      //   text: `Welcome to Wconnect website. Your account has been created with email id: ${email}`,
      // });

      await sgMail.send({
  from: process.env.SENDER_EMAIL,
  to: email,
  subject: "Welcome to Wconnect 🎉",
  text: `Welcome to Wconnect! Your account has been created with email: ${email}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: #4F46E5; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0;">Welcome to Wconnect! 🎉</h1>
      </div>
      <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; color: #333;">Hi <strong>${name}</strong>,</p>
        <p style="font-size: 16px; color: #333;">Your account has been successfully created with:</p>
        <p style="font-size: 16px; color: #4F46E5;"><strong>${email}</strong></p>
        <p style="font-size: 16px; color: #333;">We're excited to have you on board!</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.CLIENT_URL}" 
             style="background-color: #4F46E5; color: white; padding: 12px 30px; border-radius: 5px; text-decoration: none; font-size: 16px;">
            Get Started
          </a>
        </div>
        <p style="font-size: 14px; color: #999; text-align: center;">If you didn't create this account, please ignore this email.</p>
      </div>
    </div>
  `,
});
    } catch (emailError) {
      console.error("Welcome email failed:", emailError.message);
    }

    return res.status(201).json({
      success: true,
      user: newUser.rows[0],
      token: token,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}


// ================= LOGIN =================
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const user = await pool.query("SELECT * FROM users1 WHERE email = $1", [email]);

    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const userData = user.rows[0];

    const isMatch = await bcrypt.compare(password, userData.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = generateToken(userData.id);

    res.cookie("token", token, cookieOptions);

    res.json({
      success: true,
      message: "Login successful",
      token: token,
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}


// ================= LOGOUT =================
export function logout(req, res) {
  res.clearCookie("token", { ...cookieOptions });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
}


// ================= SEND VERIFY OTP =================
export async function sendVerifyOtp(req, res) {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const userResult = await pool.query("SELECT * FROM users1 WHERE id = $1", [userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const user = userResult.rows[0];

    if (user.is_account_verified) {
      return res.status(400).json({ success: false, message: "Account already verified" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    await pool.query(
      `UPDATE users1 SET verify_otp = $1, verify_otp_expire = $2 WHERE id = $3`,
      [otp, expiry, userId]
    );

    // await sgMail.send({
    //   from: process.env.SENDER_EMAIL,
    //   to: user.email,
    //   subject: "Verify Your Account - OTP",
    //   text: `Your verification OTP is ${otp}. It expires in 10 minutes.`,
    // });

    await sgMail.send({
  from: process.env.SENDER_EMAIL,
  to: user.email,
  subject: "Verify Your Account - OTP",
  text: `Your verification OTP is ${otp}. It expires in 10 minutes.`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); padding: 40px 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <div style="font-size: 48px; margin-bottom: 10px;">🔐</div>
        <h1 style="color: white; margin: 0; font-size: 26px;">Verify Your Account</h1>
        <p style="color: rgba(255,255,255,0.8); margin-top: 8px; font-size: 15px;">Enter this OTP to confirm your email</p>
      </div>
      <div style="background-color: white; padding: 40px 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
        <p style="font-size: 16px; color: #333;">Hi <strong>${user.name}</strong>,</p>
        <p style="font-size: 15px; color: #555; line-height: 1.6;">Use the OTP below to verify your Wconnect account. This code expires in <strong>10 minutes</strong>.</p>
        
        <div style="background-color: #F5F3FF; border: 2px dashed #7C3AED; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
          <p style="margin: 0 0 8px; font-size: 13px; color: #7C3AED; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Your OTP Code</p>
          <p style="margin: 0; font-size: 42px; font-weight: 800; color: #4F46E5; letter-spacing: 10px;">${otp}</p>
        </div>

        <p style="font-size: 14px; color: #888; line-height: 1.6; text-align: center;">⏰ This OTP will expire in <strong>10 minutes</strong>. Do not share it with anyone.</p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="font-size: 13px; color: #aaa; text-align: center; margin: 0;">If you didn't request this, please ignore this email.</p>
      </div>
    </div>
  `,
});

    return res.status(200).json({ success: true, message: "Verification OTP sent successfully" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
}


// ================= VERIFY OTP =================
export async function verifyOtp(req, res) {
  try {
    const { otp } = req.body;
    const userId = req.user.id;

    if (!userId || !otp) {
      return res.status(400).json({ success: false, message: "User ID and OTP are required" });
    }

    const userResult = await pool.query("SELECT * FROM users1 WHERE id = $1", [userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const user = userResult.rows[0];

    if (user.is_account_verified) {
      return res.status(400).json({ success: false, message: "Account already verified" });
    }

    if (user.verify_otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (!user.verify_otp_expire || new Date() > user.verify_otp_expire) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    await pool.query(
      `UPDATE users1 SET is_account_verified = true, verify_otp = NULL, verify_otp_expire = NULL WHERE id = $1`,
      [userId]
    );

    return res.status(200).json({ success: true, message: "Account verified successfully" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
}


// ================= IS AUTHENTICATED =================
export async function isAuthenticated(req, res) {
  try {
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}


// ================= SEND RESET OTP =================
export async function sendResetOtp(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.json({ success: false, message: "Email is required" });
    }

    const result = await pool.query("SELECT * FROM users1 WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const user = result.rows[0];

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    await pool.query(
      `UPDATE users1 SET reset_otp = $1, reset_otp_expire = $2 WHERE email = $3`,
      [otp, expiry, email]
    );

    // await sgMail.send({
    //   from: process.env.SENDER_EMAIL,
    //   to: user.email,
    //   subject: "Reset your password",
    //   text: `Your OTP to reset password is ${otp}. It expires in 10 minutes.`,
    // });


    await sgMail.send({
  from: process.env.SENDER_EMAIL,
  to: user.email,
  subject: "Reset Your Password - Wconnect",
  text: `Your OTP to reset password is ${otp}. It expires in 10 minutes.`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background: linear-gradient(135deg, #DC2626 0%, #9F1239 100%); padding: 40px 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <div style="font-size: 48px; margin-bottom: 10px;">🔑</div>
        <h1 style="color: white; margin: 0; font-size: 26px;">Reset Your Password</h1>
        <p style="color: rgba(255,255,255,0.8); margin-top: 8px; font-size: 15px;">We received a request to reset your password</p>
      </div>
      <div style="background-color: white; padding: 40px 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
        <p style="font-size: 16px; color: #333;">Hi <strong>${user.name}</strong>,</p>
        <p style="font-size: 15px; color: #555; line-height: 1.6;">Use the OTP below to reset your Wconnect password. This code expires in <strong>10 minutes</strong>.</p>

        <div style="background-color: #FFF1F2; border: 2px dashed #DC2626; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
          <p style="margin: 0 0 8px; font-size: 13px; color: #DC2626; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Your OTP Code</p>
          <p style="margin: 0; font-size: 42px; font-weight: 800; color: #9F1239; letter-spacing: 10px;">${otp}</p>
        </div>

        <p style="font-size: 14px; color: #888; line-height: 1.6; text-align: center;">⏰ This OTP will expire in <strong>10 minutes</strong>. Do not share it with anyone.</p>

        <div style="background-color: #FFF7ED; border-left: 4px solid #F97316; padding: 16px; border-radius: 4px; margin: 24px 0;">
          <p style="margin: 0; font-size: 14px; color: #92400E;">⚠️ If you didn't request a password reset, please secure your account immediately.</p>
        </div>

        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="font-size: 13px; color: #aaa; text-align: center; margin: 0;">If you didn't request this, please ignore this email.</p>
      </div>
    </div>
  `,
});

    return res.status(200).json({ success: true, message: "Reset OTP sent successfully" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
}


// ================= RESET PASSWORD =================
export async function resetPassword(req, res) {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.json({ success: false, message: "Email, otp and new password are required" });
    }

    const result = await pool.query("SELECT * FROM users1 WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      return res.json({ success: false, message: "User not found" });
    }

    const user = result.rows[0];

    if (user.reset_otp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (new Date(user.reset_otp_expire) < new Date()) {
      return res.json({ success: false, message: "OTP expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      `UPDATE users1 SET password = $1, reset_otp = NULL, reset_otp_expire = NULL WHERE email = $2`,
      [hashedPassword, email]
    );

    return res.json({ success: true, message: "Password reset successful" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
}