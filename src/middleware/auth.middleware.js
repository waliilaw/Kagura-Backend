const jwt = require('jsonwebtoken')
const User = require('../models/user.model.js')

const protectRoute = async(req , res, next ) => {

    try{
        const token  = req.cookies.jwt
        if(!token){
            return res.status(401).json({message : "Unauthorized"})
        }
        const decoded = jwt.verify(token , process.env.JWT_SECRET)
        if(!decoded){
            return res.status(401).json({message : "Unauthorized"})
        }
        const user = await User.findById(decoded.userId).select('-password')
        if(!user){
            return res.status(401).json({message : "Unauthorized"})
        }
        req.user = user
        next()
    }
    catch(error){
        console.log('Error (protect route): ', error.message)
        res.status(500).json({message : "Internal server error"})
    }
}

module.exports = protectRoute