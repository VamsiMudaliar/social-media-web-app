const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

dotenv.config()
mongoose.connect(process.env.MONGO_URL,{useNewUrlParser:true},()=>{
    console.log('Connected to MongoDb');
})

// middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use('/api/user',require('./routes/users'));
app.use('/api/auth',require('./routes/auth'));
app.use('/api/posts',require('./routes/post'));

app.listen(8800,()=>{
    console.log('Server is running at Port : 8800');
});

