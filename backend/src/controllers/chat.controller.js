const chatModel=require('../models/chat.model');
const messageModel=require('../models/message.model');

async function createChat(req,res) {
    const {title}=req.body;
    const user=req.user;

    const chat=await chatModel.create({
        title,
        user:user._id,
    });
    res.status(201).json({
        message:"Chat created successfully.",
        chat:{
            user:chat._id,
            title:chat.title,
            lastActivity:chat.lastActivity
        }
    });
};

async function getChats(req, res) {
    const chats = await chatModel.find({ user: req.user._id })
        .sort({ updatedAt: -1 })
        .lean();

    res.json({ chats });
}

async function getChatMessages(req, res) {
    const messages = await messageModel.find({ chat: req.params.chatId })
        .sort({ createdAt: 1 })
        .lean();

    res.json({ messages });
}

const sendMessage=async(req,res)=>{
     try {
        const { chatId } = req.params;
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message content is required" });
        }

        // Create and save message
        const newMessage = new Message({
            chat: chatId,
            sender: req.user._id, // from auth middleware
            content: message,
        });

        await newMessage.save();

        // (optional) push into chat's messages array
        await Chat.findByIdAndUpdate(chatId, {
            $push: { messages: newMessage._id }
        });

        // Simulate AI reply (replace with real AI service later)
        const aiReply = "🤖 AI says: " + message;

        const aiMessage = new Message({
            chat: chatId,
            sender: null,
            content: aiReply,
        });

        await aiMessage.save();
        await Chat.findByIdAndUpdate(chatId, {
            $push: { messages: aiMessage._id }
        });

        res.json({
            success: true,
            reply: aiReply,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to send message" });
    }
}

module.exports={
    createChat,
    getChatMessages,
    getChats,
    sendMessage
}
