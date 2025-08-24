const { Server } =require("socket.io");
const cookie=require('cookie')
const jwt=require('jsonwebtoken')
const userModel=require('../models/user.model')
const aiService=require('../services/ai.service')
const messageModel=require('../models/message.model')
const {createMemory,queryMemory}=require("../services/vector.service");

function setupSocketServer(httpServer){
    const io=new Server(httpServer,{});

    io.use(async(socket,next)=>{
        const cookies=cookie.parse(socket.handshake.headers?.cookie || "")

        if(!cookies.token){
            return next(new Error("Authentication error:No token provided."))
        }
        try {
            const decoded=jwt.verify(cookies.token,process.env.JWT_SECRET_KEY)
            const user=await userModel.findById(decoded.id)
            socket.user=user
            next()
        } catch (error) {
            return next(new Error("Authentication error:No token provided."))
        }
    })

    io.on('connection',(socket)=>{
        console.log('A user connected')

        socket.on('ai-message',async(messagePayload)=>{

            const [message,vectors]=await Promise.all([
                messageModel.create({
                user:socket.user._id,
                content:messagePayload.content,
                role:"user",
                chat:messagePayload.chat
            }),
            aiService.generateVector(messagePayload.content)
            ])

            await createMemory({
                vectors,
                messageId: message._id,
                metadata: {
                    chat: messagePayload.chat,
                    user: socket.user._id,
                    text: messagePayload.content
                }
            })

            const [memory,chathistory]=await Promise.all([
                queryMemory({
                queryVector:vectors,
                limit:3,
                metadata:{user:socket.user._id}
            }),
                messageModel.find({chat:messagePayload.chat}).sort({ createdAt: -1 }).limit(20).lean()
                .then(messages => messages.reverse())
            ])

            const stm=chathistory.map(item=>{
                return {
                    role:item.role,
                    parts:[{text:item.content}]
                }
            })

            const ltm=[
                {
                    role:"user",
                    parts:[{text:`those are some previous memory from the chat,use them to generate a response
                        ${memory.map(e=>e.metadata.text).join('\n')}`}]
                }
            ]

            const response=await aiService.generateResponse([...ltm,...stm])

            socket.emit('ai-response',{
                content:response,
                chat:messagePayload.chat
            })

            const [responseMessage,responseVectors]=await Promise.all([
                messageModel.create({
                chat: messagePayload.chat,
                user: socket.user._id,
                content: response,
                role: "model"
            }),
            aiService.generateVector(response)
            ])

            await createMemory({
                vectors: responseVectors,
                messageId: responseMessage._id,
                metadata: {
                    chat: messagePayload.chat,
                    user: socket.user._id,
                    text: response
                }
            })
        })

        socket.on('disconnect',()=>{
            console.log('A user disconnected.')
        })
    });
};

module.exports=setupSocketServer;