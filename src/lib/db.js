const mongoose = require('mongoose')
const dotenv = require('dotenv')
require('dotenv').config()
const connectDB = async () => {
    try{
       const connect =  await mongoose.connect(process.env.MONGO_URI)
      console.log('MongoDB connection success')
    }
    catch(error){
        console.log('MongoDB connection failed : ', error)
    }
}
console.log(process.env.MONGO_URI)

module.exports = connectDB