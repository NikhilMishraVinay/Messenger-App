const router = require('express').Router();

const {userRegister,userLogin,userLogout, image} = require('../controller/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/user-login',userLogin);
router.post('/user-register',userRegister);
//router.post('/user-logout',authMiddleware,userLogout);
router.get("/user-image/:userId", image);

module.exports = router;