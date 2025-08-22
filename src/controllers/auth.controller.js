const jwt=require('jsonwebtoken');
const userModel=require('../models/user.model');
const bcrypt=require('bcryptjs');

async function registerUser(req,res) {
    const {fullName:{firstName,lastName},email,password}=req.body;

    const ifUserExist=await userModel.findOne({
        email
    });
    if(ifUserExist){
        return res.status(401).json({
            message:"User already exists."
        });
    };

    const hashPassword=await bcrypt.hash(password,10);
    const newUser=await userModel.create({
        fullName:{
            firstName,lastName
        },
        email:email,
        password :hashPassword
    });

    const token=jwt.sign({id:newUser._id},process.env.JWT_SECRET_KEY)
    res.cookie("token",token)

    return res.status(201).json({
        message:"User registered successfully."
    })
};

async function loginUser(req,res) {
    const {email,password}=req.body;

    const user=await userModel.findOne({
        email
    });
    if(!user){
        return res.status(401).json({
            message:"INVALID: email or password."
        });
    };

    const isPasswordValid=await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
        return res.status(401).json({
            message:"INVALID: email or password."
        });
    };

    const token=jwt.sign({id:user._id},process.env.JWT_SECRET_KEY);
    res.cookie("token",token);

    return res.status(200).json({
        message:"User logged in successfully."
    });
};

module.exports={
    registerUser,
    loginUser
};