import express from "express";
import { sendMessage, getRoomMessages, sendDirectMessage, getDirectMessages } from "../controllers/message.controller.js";
import { middlewareAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/send", middlewareAuth, sendMessage);
router.get("/room/:roomId", middlewareAuth, getRoomMessages);
router.post("/dm/send", middlewareAuth, sendDirectMessage);
router.get("/dm/:userId", middlewareAuth, getDirectMessages);

export default router;