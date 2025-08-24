require('dotenv').config();
const http=require('http');
const app=require('./src/app');
const connectToDB=require('./src/db/db');
const setupSocketServer=require('./src/sockets/socket.server');

const httpServer=http.createServer(app);
connectToDB();
setupSocketServer(httpServer);


httpServer.listen(3000,()=>{
    console.log("Server is running on port 3000.");
});