const express=require('express');
const authMiddlewares=require('../middlewares/auth.middleware');
const chatControllers=require('../controllers/chat.controller');

const router=express.Router();

router.route('/')
    .post(authMiddlewares.authUser,chatControllers.createChat);

module.exports=router;