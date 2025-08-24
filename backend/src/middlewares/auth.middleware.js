const jwt=require('jsonwebtoken');
const userModel=require('../models/user.model');

async function authUser(req,res,next) {
    const {token}=req.cookies;

    if(!token){
        return res.status(401).json({
            message:"User is unauthorized."
        });
    };

    try {
        const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY);
        const verifedUser=await userModel.findOne({_id:decoded.id});
        if(!verifedUser){
            return res.status(401).json({
                message:"Unauthorized:User is not authenticated to access the resource."
            });
        };
        
        req.user=verifedUser;

        next();
    } catch (error) {
        console.error("Error verifying token:", error);
    };
};

module.exports={
    authUser
};