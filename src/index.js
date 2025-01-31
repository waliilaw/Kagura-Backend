const express = require('express')
const connectDB = require('./lib/db')
const dotenv = require('dotenv')
const cors = require('cors')    
const cookieParser = require('cookie-parser')
require('dotenv').config();
const app = express()

app.use(express.json())

app.use(cors(
  {  
        origin: ["http://localhost:3000"],
        credentials: true
    }
))
app.use(cookieParser())
connectDB()

//AUTH
const authRoutes = require('./routes/auth.route');
const { connect } = require('http2');
app.use('/api/auth', authRoutes)

//PORT 
const PORT = process.env.PORT 
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})