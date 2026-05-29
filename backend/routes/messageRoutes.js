import express from "express";
import Message from "../models/message.js";
import User from "../models/user.js";

const router = express.Router();

// Get messages between two users
router.get("/:senderId/:receiverId", async (req, res) => {
    try {
        const { senderId, receiverId } = req.params;
        const messages = await Message.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId }
            ]
        }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all contacts a user has interacted with
router.get("/contacts/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Find distinct users involved in messages with this user
        const sentMessages = await Message.find({ sender: userId }).distinct("receiver");
        const receivedMessages = await Message.find({ receiver: userId }).distinct("sender");
        
        const contactIds = [...new Set([...sentMessages, ...receivedMessages])];
        const contacts = await User.find({ _id: { $in: contactIds } }).select("-password");
        
        res.json(contacts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
