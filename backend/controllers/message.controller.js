import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
//import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
	try {
		//req attributes: message, *receiverId, user
		const { message } = req.body;
		const { id: receiverId } = req.params; //assign id at the end of url /send/:id" to receiverId
		const senderId = req.user._id; //protectRoute.js adds user to req attributes, and ._id is a special field for mognoose models

		//find the specific conversation between the sender and receiver (no groupchats)
		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] },
		});

		//if this convo doesn't exist, open up a new DM
		if (!conversation) {
			conversation = await Conversation.create({
				participants: [senderId, receiverId],
			});
		}

		//initialize a new message
		const newMessage = new Message({
			senderId,
			receiverId,
			message,
		});

		//if new message is successfully created, add the _id to the messages attribute of conversation object
		if (newMessage) {
			conversation.messages.push(newMessage._id);
		}

        // SOCKET IO FUNCTIONALITY WILL GO HERE

		// await conversation.save();
		// await newMessage.save();

		// saves the message to db, access by going to MongoDB website > cluster > chat-app-db > conversations/messages
		// the Promise.all() allows us to run conversation.save() and newMessage.save() in parallel
		await Promise.all([conversation.save(), newMessage.save()]);

		res.status(201).json(newMessage);
	} catch (error) {
		console.log("Error in sendMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getMessages = async (req, res) => {
    try {
        const {id:userToChatId} = req.params; //get req.params.id and rename to userToChatId
        const senderId = req.user._id; //get user._id again using protectRoute.js

		console.log(senderId)
        //conversation document, has array of mesage references as an attribute, use mongoose populate method to get actual contents of each message
        const conversation = await Conversation.findOne({
            participants: {$all: [senderId, userToChatId]},
        }).populate("messages");

        //if not messages, successful request but returned array will be empty
        if (!conversation) return res.status(200).json([]);

        const messages = conversation.messages;
        res.status(200).json(messages);

    } catch (error) {
        console.log("Error in getMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
    }
}