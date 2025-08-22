const { Server } =require("socket.io");
const cookie=require('cookie')
const jwt=require('jsonwebtoken')
const userModel=require('../models/user.model')
const aiService=require('../services/ai.service')
const messageModel=require('../models/message.model')
const {createMemory,queryMemory}=require("../services/vector.service");
const { QueryVectorFromJSON } = require("@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data");

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

            const message=await messageModel.create({
                user:socket.user._id,
                content:messagePayload.content,
                role:"user",
                chat:messagePayload.chat
            })

            const vectors=await aiService.generateVector(messagePayload.content)
            const memory=await queryMemory({
                queryVector:vectors,
                limit:3,
                metadata:{user:socket.user._id}
            })

            await createMemory({
                vectors,
                messageId: message._id,
                metadata: {
                    chat: messagePayload.chat,
                    user: socket.user._id,
                    text: messagePayload.content
                }
            })

            const chathistory=(await messageModel.find({
                chat:messagePayload.chat
            }).sort({ createdAt: -1 }).limit(20).lean()).reverse()

            const stm=chathistory.map(item=>{
                return {
                    role:item.role,
                    parts:[{text:item.content}]
                }
            })

            const ltm=[
                {
                    role:"system",
                    parts:[{text:`those are some previous memory from the chat,use them to generate a response
                        ${memory.map(e=>e.metadata.text).join('\n')}`}]
                }
            ]

            const response=await aiService.generateResponse([...ltm,...stm])

            const responseMessage = await messageModel.create({
                chat: messagePayload.chat,
                user: socket.user._id,
                content: response,
                role: "model"
            })

            const responseVectors = await aiService.generateVector(response)

            await createMemory({
                vectors: responseVectors,
                messageId: responseMessage._id,
                metadata: {
                    chat: messagePayload.chat,
                    user: socket.user._id,
                    text: response
                }
            })

            
            socket.emit('ai-response',{
                content:response,
                chat:messagePayload.chat
            })
        })

        socket.on('disconnect',()=>{
            console.log('A user disconnected.')
        })
    });
};

module.exports=setupSocketServer;