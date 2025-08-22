const express=require('express');
const cookieParser=require('cookie-parser')

//Routes
const authRoutes=require('./routes/auth.route')
const chatRoutes=require('./routes/chat.route')

const app=express();

//Middlewares
app.use(express.json());
app.set(express.urlencoded,{require:true});
app.use(cookieParser())

//Using Routes
app.use('/auth',authRoutes)
app.use('/api/chat',chatRoutes)

module.exports=app;