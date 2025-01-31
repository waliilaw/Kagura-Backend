const express = require('express')
const { signup, login, logout , updateProfile, checkAuth} = require('../controllers/auth.controller.js')
const  protectRoute  = require('../middleware/auth.middleware.js')

const router = express.Router()

router.get('/signup' , signup )

router.get('/login' , login )
 
router.get('/logout' , logout)

router.put('/update-profile' , protectRoute , updateProfile)

module.exports = router