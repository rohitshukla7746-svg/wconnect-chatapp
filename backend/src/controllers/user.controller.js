import pool from "../lib/db.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const getUserData = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query("SELECT * FROM users1 WHERE id = $1", [userId]);
    if (result.rows.length === 0) {
      return res.json({ success: false, message: "User not found" });
    }
    const user = result.rows[0];
    res.json({
      success: true,
      userData: {
        id: user.id,
        name: user.name,
        email: user.email,
        bio: user.bio || "",
        avatar: user.avatar || "",
        is_account_verified: user.is_account_verified,
      }
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, bio } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Name is required" });
    const result = await pool.query(
      `UPDATE users1 SET name = $1, bio = $2 WHERE id = $3 RETURNING id, name, email, bio, avatar, is_account_verified`,
      [name, bio || "", userId]
    );
    res.json({
      success: true,
      message: "Profile updated successfully",
      userData: {
        id: result.rows[0].id,
        name: result.rows[0].name,
        email: result.rows[0].email,
        bio: result.rows[0].bio || "",
        avatar: result.rows[0].avatar || "",
        is_account_verified: result.rows[0].is_account_verified,
      }
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const updateAvatar = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!req.file) return res.status(400).json({ success: false, message: "No image uploaded" });
    const avatarUrl = req.file.path;
    const result = await pool.query(
      `UPDATE users1 SET avatar = $1 WHERE id = $2 RETURNING id, name, email, bio, avatar, is_account_verified`,
      [avatarUrl, userId]
    );
    res.json({
      success: true,
      message: "Avatar updated successfully",
      userData: {
        id: result.rows[0].id,
        name: result.rows[0].name,
        email: result.rows[0].email,
        bio: result.rows[0].bio || "",
        avatar: result.rows[0].avatar || "",
        is_account_verified: result.rows[0].is_account_verified,
      }
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      `SELECT id, name, email, avatar, bio FROM users1 WHERE id != $1 ORDER BY name ASC`,
      [userId]
    );
    res.json({ success: true, users: result.rows });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    const result = await pool.query("SELECT * FROM users1 WHERE id = $1", [userId]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, message: "User not found" });
    const user = result.rows[0];
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Current password is incorrect" });
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users1 SET password = $1 WHERE id = $2", [hashedPassword, userId]);
    res.json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
