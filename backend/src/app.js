const express=require('express');
const cookieParser=require('cookie-parser')
const cors=require('cors')

//Routes
const authRoutes=require('./routes/auth.route')
const chatRoutes=require('./routes/chat.route')

const app=express();

//Middlewares
app.use(cors({
    origin:'http://localhost:5173',
    methods:['GET','POST','PUT','DELETE'],
    credentials:true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

//Using Routes
app.use('/auth',authRoutes)
app.use('/api/chat',chatRoutes)

module.exports=app;