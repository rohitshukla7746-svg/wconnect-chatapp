import express from "express";
import { createRoom, joinRoom, getRooms, getRoom } from "../controllers/room.controller.js";
import { middlewareAuth } from "../middleware/auth.middleware.js";;

const router = express.Router();

router.get("/", middlewareAuth, getRooms);
router.get("/:roomId", middlewareAuth, getRoom);
router.post("/create", middlewareAuth, createRoom);
router.post("/join", middlewareAuth, joinRoom);

export default router;