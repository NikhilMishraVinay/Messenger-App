const formidable = require('formidable');
const validator = require('validator');
const registerModel = require('../models/authModel');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const console = require('console');
 

module.exports.userRegister = (req, res) => {
     console.log("registration")

     const form = formidable();
     form.parse(req, async (err, fields, files) => {

     const {
          userName, email, password
     } = fields;

     const {image} = files;
     const error = [];

     if(!userName){
          error.push('Please provide your user name');
     }
     if(!email){
          error.push('Please provide your Email');
     }
     if(email && !validator.isEmail(email)){
          error.push('Please provide your Valid Email');
     }
     if(!password){
          error.push('Please provide your Password');
     }
     
     
     if(password && password.length < 6){
          error.push('Please provide password mush be 6 charecter');
     }
     if(Object.keys(files).length === 0){
          error.push('Please provide user image');
     }
     if(error.length > 0){
          res.status(400).json({
               error:{
                    errorMessage : error
               }
          })
     } else {
          const getImageName = files.image.originalFilename;
          const randNumber = Math.floor(Math.random() * 99999 );
          const newImageName = randNumber + getImageName;
          files.image.originalFilename = newImageName;

          const newPath = __dirname + `../../../frontend/public/image/${files.image.originalFilename}`;

     try {
          const checkUser = await registerModel.findOne({
               email:email
          });
          if(checkUser) {
               res.status(404).json({
                    error: {
                         errorMessage : ['Your email already exited']
                    }
               })
          }else{
               

                         const userCreate = await registerModel.create({
                              userName,
                              email,
                              password,
                         });
                         
                         userCreate.image.data = fs.readFileSync(files.image.filepath);
                         userCreate.image.contentType = files.image.mimetype;

                         await userCreate.save((err, result) => {
                              if (err) {
                                console.log("saving time err => ", err);
                                res.status(404).json({
                                   error: {
                                        errorMessage : ['Error while saving']
                                   }
                              })
                              }
                              console.log("successfully saved");
                            });

                            

                         const token = jwt.sign({
                              id : userCreate._id,
                              userName : userCreate.userName,
                         }, process.env.SECRET,{
                              expiresIn: process.env.TOKEN_EXP
                         }); 

                         const options = { expires : new Date(Date.now() + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000 )}
                         console.log(token);
                         
                         res.status(201).cookie('authToken',token, options).json({
                              successMessage : 'Your Register Successful',token,
                              
                         })

                          
               //      } else {
               //           res.status(500).json({
               //                error: {
               //                     errorMessage : ['Interanl Server Error']
               //                }
               //           })
               //      }
               // })
          }

     } catch (error) {
          //console.log(error)
          res.status(500).json({
               error: {
                    errorMessage : ['Interanl Server Error']
               }
          })

           } 

               
          } 
          
     }) // end Formidable  
    
}

module.exports.userLogin = async (req,res) => {
      const error = [];
      const {email,password} = req.body;
      console.log(email)
      console.log(password)
      if(!email){
          error.push('Please provide your Email');
     }
     if(!password){
          error.push('Please provide your Passowrd');
     }
     if(email && !validator.isEmail(email)){
          error.push('Please provide your Valid Email');
     }
     if(error.length > 0){
          res.status(400).json({
               error:{
                    errorMessage : error
               }
          })
     }else {

          try{
               const checkUser = await registerModel.findOne({
                    email:email
               }).select('+password');

               if(checkUser){
                    const matchPassword = await bcrypt.compare(password, checkUser.password );

                    if(matchPassword) {
                         const token = jwt.sign({
                              id : checkUser._id,
                              userName : checkUser.userName,
                         }, process.env.SECRET,{
                              expiresIn: process.env.TOKEN_EXP
                         }); 
      const options = { expiresIn : new Date(Date.now() + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000 ), 
          httpOnly:true,
          secure:true
     }

      
     res.status(200).cookie('authToken',token, options).json({
          successMessage : 'Your Login Successful',token,
     })

                    } else{
                         res.status(400).json({
                              error: {
                                   errorMessage : ['Your Password not Valid']
                              }
                         })
                    }
               } else{
                    res.status(400).json({
                         error: {
                              errorMessage : ['Your Email Not Found']
                         }
                    })
               }
                

          } catch{
               res.status(404).json({
                    error: {
                         errorMessage : ['Internal Sever Error']
                    }
               })
          }
     }
}


module.exports.image = async (req, res) =>{
     // console.log(req.params.userId)
     let user = await registerModel.findById(req.params.userId).exec();

     if (user && user.image && user.image.data !== null) {
          res.set("Content-Type", user.image.contentType);
          return res.send(user.image.data);
        }

}