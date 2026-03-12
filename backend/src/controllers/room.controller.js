import pool from "../lib/db.js";
import bcrypt from "bcryptjs";

// Create a room
export async function createRoom(req, res) {
  try {
    const { name, password, has_password } = req.body;
    const userId = req.user.id;

    if (!name) {
      return res.status(400).json({ success: false, message: "Room name is required" });
    }

    const roomExists = await pool.query("SELECT * FROM rooms WHERE name = $1", [name]);
    if (roomExists.rows.length > 0) {
      return res.status(400).json({ success: false, message: "Room name already taken" });
    }

    const hashedPassword = has_password && password ? await bcrypt.hash(password, 10) : null;

    const room = await pool.query(
      `INSERT INTO rooms (name, password, has_password, created_by) 
       VALUES ($1, $2, $3, $4) RETURNING id, name, has_password, created_at`,
      [name, hashedPassword, has_password || false, userId]
    );

    // Auto join the creator
    await pool.query(
      `INSERT INTO room_members (room_id, user_id) VALUES ($1, $2)`,
      [room.rows[0].id, userId]
    );

    return res.status(201).json({ success: true, room: room.rows[0] });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

// Join a room
export async function joinRoom(req, res) {
  try {
    const { roomId, password } = req.body;
    const userId = req.user.id;

    const roomResult = await pool.query("SELECT * FROM rooms WHERE id = $1", [roomId]);
    if (roomResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    const room = roomResult.rows[0];

    // If already a member, just allow entry
    const isMember = await pool.query(
      "SELECT * FROM room_members WHERE room_id = $1 AND user_id = $2",
      [roomId, userId]
    );
    if (isMember.rows.length > 0) {
      return res.status(200).json({ success: true, message: "Already a member" });
    }

    // Check password
    if (room.has_password) {
      if (!password) {
        return res.status(400).json({ success: false, message: "Password required" });
      }
      const isMatch = await bcrypt.compare(password, room.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: "Wrong password" });
      }
    }

    await pool.query(
      `INSERT INTO room_members (room_id, user_id) VALUES ($1, $2)`,
      [roomId, userId]
    );

    return res.status(200).json({ success: true, message: "Joined room successfully" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

// Get all rooms
export async function getRooms(req, res) {
  try {
    const rooms = await pool.query(
      `SELECT id, name, has_password, created_at,
       (SELECT COUNT(*) FROM room_members WHERE room_id = rooms.id) as member_count
       FROM rooms ORDER BY created_at DESC`
    );

    return res.status(200).json({ success: true, rooms: rooms.rows });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

// Get single room
export async function getRoom(req, res) {
  try {
    const { roomId } = req.params;

    const room = await pool.query(
      `SELECT id, name, has_password, created_at FROM rooms WHERE id = $1`,
      [roomId]
    );

    if (room.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    return res.status(200).json({ success: true, room: room.rows[0] });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
}