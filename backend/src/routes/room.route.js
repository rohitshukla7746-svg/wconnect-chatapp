import express from "express";
import { middlewareAuth } from "../middleware/auth.middleware.js";
import { createRoom, joinRoom, getRooms, getRoom, deleteRoom } from "../controllers/room.controller.js";

const router = express.Router();

router.get("/", middlewareAuth, getRooms);
router.get("/:roomId", middlewareAuth, getRoom);
router.post("/create", middlewareAuth, createRoom);
router.post("/join", middlewareAuth, joinRoom);
router.delete("/:roomId", middlewareAuth, deleteRoom);

export default router;
