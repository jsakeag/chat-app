import express, { Router } from "express";
import { sendMessage } from "../controllers/message.controller";
import protectRoute from "../middleware/protectRoute";

const router = express.Router();

//when we have a post request, we first run protectRoute until the next() call is reached, then we run sendMessage
//protectRoute makes sure that only authenticated users can send a message
router.post("/send/:id", protectRoute, sendMessage)

export default router;