const chatModel=require('../models/chat.model');

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

module.exports={
    createChat,
}
