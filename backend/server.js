import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";
//const app = express(); moved to socket.js as a lower layer
const PORT = process.env.PORT || 5000;

dotenv.config();

app.use(express.json()); // to parse the incoming requests with JSON payloads (from req.body)
app.use(cookieParser()); //before running routes call the middleware so we can access cookies (see protectRoute.js)

//all the different routes could be written here, but they would be disorganized
//express's solution to this is middlewares - we can create separate controller or router objects in other files which contain their own controllers
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// app.get("/", (req, res) => {
//     // root route http://localhost:5000/
//     res.send("Hello World!!");
// });

server.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server Running on port ${PORT}`)
});

//The reason we separate auth route + controller from user route + controller is that authentication is its own service & we want to keep our app structure clean