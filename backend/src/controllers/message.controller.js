import pool from "../lib/db.js";

// Send message to room
export async function sendMessage(req, res) {
  try {
    const { roomId, content } = req.body;
    const senderId = req.user.id;

    if (!content || !roomId) {
      return res.status(400).json({ success: false, message: "Room ID and content are required" });
    }

    const isMember = await pool.query(
      "SELECT * FROM room_members WHERE room_id = $1 AND user_id = $2",
      [roomId, senderId]
    );

    if (isMember.rows.length === 0) {
      return res.status(403).json({ success: false, message: "You are not a member of this room" });
    }

    const message = await pool.query(
      `INSERT INTO messages (room_id, sender_id, content) 
       VALUES ($1, $2, $3) 
       RETURNING id, room_id, sender_id, content, created_at`,
      [roomId, senderId, content]
    );

    const sender = await pool.query(
      "SELECT id, name FROM users1 WHERE id = $1",
      [senderId]
    );

    const fullMessage = {
      ...message.rows[0],
      sender_name: sender.rows[0].name,
    };

    return res.status(201).json({ success: true, message: fullMessage });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

// Get messages for a room
export async function getRoomMessages(req, res) {
  try {
    const { roomId } = req.params;
    const userId = req.user.id;

    const isMember = await pool.query(
      "SELECT * FROM room_members WHERE room_id = $1 AND user_id = $2",
      [roomId, userId]
    );

    if (isMember.rows.length === 0) {
      return res.status(403).json({ success: false, message: "You are not a member of this room" });
    }

    const messages = await pool.query(
      `SELECT m.id, m.content, m.created_at, m.sender_id,
              u.name as sender_name
       FROM messages m
       JOIN users1 u ON m.sender_id = u.id
       WHERE m.room_id = $1
       ORDER BY m.created_at ASC`,
      [roomId]
    );

    return res.status(200).json({ success: true, messages: messages.rows });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

// Delete a room message (only sender can delete)
export async function deleteMessage(req, res) {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await pool.query(
      "SELECT * FROM messages WHERE id = $1",
      [messageId]
    );

    if (message.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    if (message.rows[0].sender_id !== userId) {
      return res.status(403).json({ success: false, message: "You can only delete your own messages" });
    }

    await pool.query("DELETE FROM messages WHERE id = $1", [messageId]);

    return res.status(200).json({ success: true, message: "Message deleted" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

// Send direct message
export async function sendDirectMessage(req, res) {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user.id;

    if (!receiverId || !content) {
      return res.status(400).json({ success: false, message: "Receiver ID and content are required" });
    }

    const message = await pool.query(
      `INSERT INTO direct_messages (sender_id, receiver_id, content)
       VALUES ($1, $2, $3)
       RETURNING id, sender_id, receiver_id, content, created_at`,
      [senderId, receiverId, content]
    );

    const sender = await pool.query(
      "SELECT name FROM users1 WHERE id = $1",
      [senderId]
    );

    const fullMessage = {
      ...message.rows[0],
      sender_name: sender.rows[0].name,
    };

    return res.status(201).json({ success: true, message: fullMessage });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

// Get direct messages between two users
export async function getDirectMessages(req, res) {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    const messages = await pool.query(
      `SELECT dm.id, dm.content, dm.created_at, dm.is_read,
              dm.sender_id, dm.receiver_id,
              u.name as sender_name
       FROM direct_messages dm
       JOIN users1 u ON dm.sender_id = u.id
       WHERE (dm.sender_id = $1 AND dm.receiver_id = $2)
          OR (dm.sender_id = $2 AND dm.receiver_id = $1)
       ORDER BY dm.created_at ASC`,
      [currentUserId, userId]
    );

    return res.status(200).json({ success: true, messages: messages.rows });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

// Delete a direct message (only sender can delete)
export async function deleteDirectMessage(req, res) {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await pool.query(
      "SELECT * FROM direct_messages WHERE id = $1",
      [messageId]
    );

    if (message.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    if (message.rows[0].sender_id !== userId) {
      return res.status(403).json({ success: false, message: "You can only delete your own messages" });
    }

    await pool.query("DELETE FROM direct_messages WHERE id = $1", [messageId]);

    return res.status(200).json({ success: true, message: "Message deleted" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
