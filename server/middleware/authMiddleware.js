const jwt = require('jsonwebtoken');
const expressjwt=require("express-jwt");

module.exports.authMiddleware = async(req,res,next) => {
     const authToken = req.body.token ? req.body.token : req.fields.token;
     
     if(authToken){
          const deCodeToken = await jwt.verify(authToken,process.env.SECRET);
          
          req.myId = deCodeToken.id;
          next();
     }else{
          res.status(400).json({
               error:{
                    errorMessage: ['Please Loing First']
               }
          })
     } 
}

// module.exports.requireSignin = expressjwt({
//      // secret, expiryDate
//      secret: process.env.JWT_SECRET,
//      algorithms: ["HS256"],
//    });