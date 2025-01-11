import express, { Router } from "express";
import { getMessages, sendMessage } from "../controllers/message.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

//when we have a post request, we first run protectRoute until the next() call is reached, then we run sendMessage
//protectRoute makes sure that only authenticated users can send a message
//access id using req.params.id
router.get("/:id", protectRoute, getMessages)
router.post("/send/:id", protectRoute, sendMessage)

export default router;