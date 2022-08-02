const express = require('express');
const app = express();
const dotenv = require('dotenv')
const mongoose = require('mongoose');
const cors = require('cors')


const authRouter = require('./routes/authRoute')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const messengerRoute = require('./routes/messengerRoute');

dotenv.config()
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use('/api/messenger',authRouter);
app.use('/api/messenger',messengerRoute);


const PORT = process.env.PORT || 5000
app.get('/', (req, res)=>{
     res.send('This is from backend Sever')
})

//db connection
mongoose.connect("mongodb://nikhil:nikhil@cluster0-shard-00-00.3wase.mongodb.net:27017,cluster0-shard-00-01.3wase.mongodb.net:27017,cluster0-shard-00-02.3wase.mongodb.net:27017/?ssl=true&replicaSet=atlas-5uv9jk-shard-0&authSource=admin&retryWrites=true&w=majority")
.then(()=>console.log('db connected'))
.catch((err)=>console.log(err.message))

app.listen(PORT, ()=>{
     console.log(`Server is running on port ${PORT}`)
});
