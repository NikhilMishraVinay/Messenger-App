const {model,Schema} = require('mongoose');
const bcrypt = require('bcrypt')

const registerSchema = new Schema({
     userName : {
          type : String,
          required : true
     },
     email : {
          type: String,
          required : true
     },
     password : {
          type: String,
          required : true,
          select : false
     },
     image : {
          data: Buffer,
          contentType  : String,
     }
},{timestamps : true});

registerSchema.pre("save", function (next) {
     let user = this;
     // hash password only if user is changing the password or registering for the first time
     // make sure to use this otherwise each time user.save() is executed, password
     // will get auto updated and you can't login with original password
     if (user.isModified("password")) {
         return bcrypt.hash(user.password, 12, function (err, hash) {
         if (err) {
           console.log("BCRYPT HASH ERR ", err);
           return next(err);
         }
         user.password = hash;
         return next();
       });
     } else {
       return next();
     }
   });

module.exports = model('auth',registerSchema);