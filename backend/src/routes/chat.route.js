const express = require('express');
const authMiddlewares = require('../middlewares/auth.middleware');
const chatControllers = require('../controllers/chat.controller');

const router = express.Router();

router.route('/')
    .get(authMiddlewares.authUser, chatControllers.getChats)
    .post(authMiddlewares.authUser, chatControllers.createChat);

router.route('/:chatId')
    .get(authMiddlewares.authUser, chatControllers.getChatMessages);

// add this
router.post('/:chatId/messages', authMiddlewares.authUser, chatControllers.sendMessage);


    
module.exports = router;