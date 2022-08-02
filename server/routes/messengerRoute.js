const router = require('express').Router();
const formidable =require('express-formidable')


const {getFriends,messageUploadDB,messageGet,ImageMessageSend,messageSeen,delivaredMessage,image} = require('../controller/messengerController');
const { authMiddleware, requireSignin } = require('../middleware/authMiddleware');

router.post('/get-friends',authMiddleware, getFriends);
router.post('/send-message',authMiddleware, messageUploadDB);
router.post('/get-message/:id',authMiddleware, messageGet);
router.post('/image-message-send', formidable(),authMiddleware,ImageMessageSend);

router.post('/seen-message',authMiddleware, messageSeen);
router.post('/delivared-message',authMiddleware, delivaredMessage);
router.get("/image-msg/:userId", image);
 

module.exports = router;