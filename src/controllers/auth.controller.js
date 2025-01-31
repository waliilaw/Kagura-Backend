const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const generateToken = require('../lib/utils')

//SignUp Controller 
const signup = async (req , res) => {
    const {fullName , email , password } = req.body
    try{
if(!fullName || !email || !password)
{return res.status(400).json({message : "All fields are required"})}

     if(password.length < 4){
            return res.status(400).json({message : "Password should be atleast 4 characters long"})
     }
     const user = await User.findOne({ email });
        if(user){
            return res.status(400).json({message : "User already exists"})
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password , salt)
        const newUser = new User({
            fullName : fullName,
            email : email,
            password : hashedPassword
        })
        if(newUser){
            generateToken(newUser._id , res)
            await newUser.save()
            res.status(201).json({
                _id : newUser._id,
                fullName : newUser.fullName,
                email : newUser.email,
                proflePic : newUser.profilePic,
                message : "User created successfully"})
        }
        else{
        res.status(400).json({message : "Invalid user data"})
        }
    }
    catch(error){
        res.status(500).json({message : "Internal server error (signup controller)" , error})
        console.log('Error : ', error.message)
    }
}

//Login Controller
const login = async (req , res) => {
    const {email , password} = req.body
try{
    const user= await User.findOne({email})
    if(!user){return res.status(400).json({messege :"Enter Valid Credentials"})}
    const PassCorrect = await bcrypt.compare(password, user.password)
    if(!PassCorrect){return res.status(400).json({message : "Invalid Credentials"})}

    generateToken(user._id , res)
    res.status(200).json({
        _id : user._id,
        fullName : user.fullName,
        email : user.email,
        profilePic : user.profilePic,
        message : "User logged in successfully"
    })
}
catch(error){
    console.log('Error (login controller): ', error.message)
    res.status(500).json({messege : "Internal server error"})
}
}

// Logout Controller 
const logout = (req , res) => {
    try{
        res.cookie("jwt" , "" , {maxAge:0})
        res.status(200).json({messege : "Logged out successfully"})
    }
    catch(error){
        res.status(500).json({message : "Internal server error"})
        console.log('Error (logout controller): ', error.message)
    }
}

// Update Profile 
const updateProfile = async (req , res) => {
    const {fullName , email , password} = req.body
    try{
        const {profilePic} = req.body
        const userId = res.user._id

    if(!profilePic){return res.status(400).json({message : "Profile pic is req"})}
   
    const uploadResponse = await cloudinar.uploader.upload(profilePic)
    const updatedUser = User.findbyIdAndUpdate(
        userId ,
       {profilePic : uploadResponse.secure_url},
         {new : true})
         res.status(200).json({updatedUser})
}
catch(error){
    console.log('Error (updateProfile): ' , error.messege)
    res.send(500).json({message : "Internal Server Error"})
}}

// Check Auth
const checkAuth = (req , res) => {
    try{
        res.status(200).json(req.user)
        console.log(`User ${req.user.fullName} is authenticated`)
    }
    catch(error){
        res.status(500).json({message : "Internal server error"})
        console.log('Error (checkAuth): ', error.message)
    }
}
module.exports = {signup , login , logout , updateProfile, checkAuth}