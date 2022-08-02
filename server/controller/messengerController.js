const User = require('../models/authModel');
const messageModel = require('../models/messageModel');
const formidable = require('formidable');
const fs = require('fs');


const getLastMessage = async (myId, fdId) => {
     const msg = await messageModel.findOne({
          $or: [{
               $and: [{
                    senderId: {
                         $eq: myId
                    }
               }, {
                    reseverId: {
                         $eq: fdId
                    }
               }]
          }, {
               $and: [{
                    senderId: {
                         $eq: fdId
                    }
               }, {
                    reseverId: {
                         $eq: myId
                    }
               }]
          }]

     }).sort({
          updatedAt: -1
     });
     return msg;
}

module.exports.getFriends = async (req, res) => {
     const myId = req.myId;
     let fnd_msg = [];
     try {
          const friendGet = await User.find({
               _id: {
                    $ne: myId
               }
          });
          // for (let i = 0; i < friendGet.length; i++ ){
          //      let lmsg = await getLastMessage(myId,friendGet[i].id);
          //      fnd_msg = [...fnd_msg, {
          //           fndInfo : friendGet[i],
          //           msgInfo : lmsg
          //      }]

          // }

          // const filter = friendGet.filter(d=>d.id !== myId );
          res.status(200).json({ success: true, friends: friendGet })

     } catch (error) {
          res.status(500).json({
               error: {
                    errorMessage: 'Internal Sever Error'
               }
          })
     }
}

module.exports.messageUploadDB = async (req, res) => {
     // console.log(req.myId)
     const {
          senderName,
          reseverId,
          message
     } = req.body.data

     const senderId = req.myId;

     try {
          const insertMessage = await messageModel.create({
               senderId: senderId,
               senderName: senderName,
               reseverId: reseverId,
               message: {
                    text: message,
                    image: ''
               }
          })
          res.status(201).json({
               success: true,
               message: insertMessage
          })

     } catch (error) {
          res.status(500).json({
               error: {
                    errorMessage: 'Internal Sever Error'
               }
          })
     }


}
module.exports.messageGet = async (req, res) => {
     const myId = req.myId;
     const fdId = req.params.id;

     try {
          let getAllMessage = await messageModel.find({

               $or: [{
                    $and: [{
                         senderId: {
                              $eq: myId
                         }
                    }, {
                         reseverId: {
                              $eq: fdId
                         }
                    }]
               }, {
                    $and: [{
                         senderId: {
                              $eq: fdId
                         }
                    }, {
                         reseverId: {
                              $eq: myId
                         }
                    }]
               }]
          })

          // getAllMessage = getAllMessage.filter(m=>m.senderId === myId && m.reseverId === fdId || m.reseverId ===  myId && m.senderId === fdId );

          res.status(200).json({
               success: true,
               message: getAllMessage
          })

     } catch (error) {
          res.status(500).json({
               error: {
                    errorMessage: 'Internal Server error'
               }
          })

     }

}


module.exports.ImageMessageSend = async (req, res) => {
     const senderId = req.myId;
     //console.log(req.myId);
     // const form = formidable();
     // //console.log("here")
     // form.parse(req, (err, fields, files) => {

     //console.log("here")
     const {
          senderName,
          reseverId,
          imageName,
          token
     } = req.fields;
     files = req.files;
     const newPath = __dirname + `../../../frontend/public/image/${imageName}`
     //files.image.originalFilename = imageName;

     try {
          data = fs.readFileSync(files.image.path);
          contentType = files.image.type;

          const insertMessage = await messageModel.create({
               senderId: senderId,
               senderName: senderName,
               reseverId: reseverId,
               message: {
                    text: '',
                    image: {
                         data: data,
                         contentType  : contentType,
                    } 
               }
          })
          res.status(201).json({
               success: true,
               message: insertMessage
          })


     } catch (error) {
          res.status(500).json({
               error: {
                    errorMessage: 'Internal Sever Error'
               }
          })

     }


     // })
}

module.exports.messageSeen = async (req, res) => {
     const messageId = req.body._id;

     await messageModel.findByIdAndUpdate(messageId, {
          status: 'seen'
     })
          .then(() => {
               res.status(200).json({
                    success: true
               })
          }).catch(() => {
               res.status(500).json({
                    error: {
                         errorMessage: 'Internal Server Error'
                    }
               })
          })
}


module.exports.delivaredMessage = async (req, res) => {
     const messageId = req.body._id;

     await messageModel.findByIdAndUpdate(messageId, {
          status: 'delivared'
     })
          .then(() => {
               res.status(200).json({
                    success: true
               })
          }).catch(() => {
               res.status(500).json({
                    error: {
                         errorMessage: 'Internal Server Error'
                    }
               })
          })
}

module.exports.image = async (req, res) =>{
     console.log(req.params.userId)
     let user = await messageModel.findById(req.params.userId).exec();

     if (user && user.message && user.message.image && user.message.image.data !== null) {
          res.set("Content-Type", user.message.image.contentType);
          return res.send(user.message.image.data);
        }

}