const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    fullName:{
        firstName:{
            type:String,
            require:true
        },
        lastName:{
            type:String,
            require:true
        }
    },
    email:{
        type:String,
        require:true,
        unique:true,
    },
    password:{
        type:String,
        require:true,
        unique:true
    }
},{
    timestamps:true
});

const userModel=mongoose.model('user',userSchema);

module.exports=userModel;