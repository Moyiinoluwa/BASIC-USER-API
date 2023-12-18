const express = require('express')
const Controller = require('../Controllers/userController')

const router = express.Router()


//get all users
router.get('/', Controller.getUser)

//get user by id
router.get('/:id', Controller.getUserId )

//register user
router.post('/register', Controller.createUser)

//register user with link vaidation
router.post('/register-link', Controller.createUserLink) 

//login user
router.post('/login', Controller.loginUser)

//verify otp
router.post('/verify-otp', Controller.verifyOtp)

//verify otp with link
router.post('/verify-otp-link', Controller.verifyOtpLink)

//resend otp
router.post('/resend-otp', Controller.resendOtp)

//reset password token
router.post('/reset-password-token', Controller.resetPasswordToken)

//change password
router.patch('/change-password', Controller.changePassword)

//update user
router.put('/update/:id', Controller.updateUser)

//delete user
router.delete('/delete/:id', Controller.deleteuser)


module.exports = router; 