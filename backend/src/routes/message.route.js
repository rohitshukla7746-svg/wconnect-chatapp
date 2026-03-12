import express from "express";
import { middlewareAuth } from "../middleware/auth.middleware.js";
import {
  sendMessage, getRoomMessages, deleteMessage,
  sendDirectMessage, getDirectMessages, deleteDirectMessage
} from "../controllers/message.controller.js";

const router = express.Router();

router.post("/send", middlewareAuth, sendMessage);
router.get("/room/:roomId", middlewareAuth, getRoomMessages);
router.delete("/message/:messageId", middlewareAuth, deleteMessage);

router.post("/dm/send", middlewareAuth, sendDirectMessage);
router.get("/dm/:userId", middlewareAuth, getDirectMessages);
router.delete("/dm/:messageId", middlewareAuth, deleteDirectMessage);

export default router;
