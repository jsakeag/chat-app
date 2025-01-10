import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getUsersForSidebar } from "../controllers/user.controller.js";

const router = express.Router();

//when we have a get request, we first run protectRoute until the next() call is reached, then we run getUsersForSidebar
//protectRoute makes sure that only authenticated users can get users
router.get("/", protectRoute, getUsersForSidebar)

export default router;
