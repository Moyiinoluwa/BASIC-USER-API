const asyncHandler = require('express-async-handler');
const User = require('../Model/userModel')
const Otp = require('../Model/otpModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { signupValidation, 
    loginValidator, 
    otpValidation , 
    resendOtpValidation, 
    passwordTokenValidation,
    changePasswordValidation} = require('../Validation/validation');
const { otpMail, otpWelcomeMail, reSetPasswordMail } = require('../Shared/mailer');



//Generate OTP
const generateOtp = () => {
    const min = 10000;
    const max = 99999;
    const otp = Math.floor(max + Math.random() * (max - min + 1)).toString()
    return otp
}

//Route to GET user
const getUser = asyncHandler(async (req, res) => {
    try {
        const user = await User.find()
        res.status(200).json(user)
    } catch (error) {
        throw error
    }
})

//Route to GET user ID
const getUserId = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        res.status(200).json(user)
        if (!user) {
            res.status(404).json({ message: 'User not found' })
        }
    } catch (error) {
        throw error
    }
});

//POST route to register a user
const createUser = asyncHandler(async (req, res) => {
    try {
        const { error, value } = await signupValidation(req.body, { abortEarly: false })
        if (error) {
          return  res.status(400).json(error.message)
        }

        const { username, email, password } = req.body;

        //check if user has been registered
        const isUser = await User.findOne({ email })
        if (isUser) {
            res.status(403).json({ message: 'user already exist' })
        }

        //hash password
        const hashPass = await bcrypt.hash(password, 10)

        //register new user
        const user = User({
            username,
            email,
            password: hashPass
        });

        //save to database
        await user.save()

        //generate otp and send verification email to user
        const verificationCode = generateOtp()
        await otpMail(email, verificationCode, username)

        //set expiration time
        const timeLimit = new Date();
        timeLimit.setMinutes(timeLimit.getMinutes() + 5)

        //save to otp table
        const otpUser = new Otp()
        otpUser.email = user.email,
        otpUser.otp = verificationCode,
        otpUser.expirationTime = timeLimit

        await otpUser.save()

        res.status(200).json(user)

    } catch (error) {
        throw error
    }
});


//POST route to register a user
const createUserLink = asyncHandler(async (req, res) => {
    try {
        const { error, value } = await signupValidation(req.body, { abortEarly: false })
        if (error) {
            res.status(400).json(error.message)
        }

        const { username, email, password } = req.body;

        //check if user has been registered
        const isUser = await User.findOne({ email })
        if (isUser) {
            res.status(403).json({ message: 'user already exist' })
        }

        //hash password
        const hashPass = await bcrypt.hash(password, 10)

        //register new user
        const user = User({
            username,
            email,
            password: hashPass
        })

        //save to database
         await user.save()

        //generate verification 
        const verificationCode = generateOtp()

        //generate otp and send verification email to user
        const verificationLink = `http://localhost/4001/api/users/verify-otp/?token${verificationCode}&email${email}`
        await otpMail(email, verificationLink, username)

        //set expiration time
        const timeLimit = new Date()
        timeLimit.setMinutes(timeLimit.getMinutes() + 5)

        //save to otp table
        const otpUser = new Otp()
        otpUser.email = user.email,
        otpUser.otp = verificationCode,
        otpUser.expirationTime = timeLimit

        await otpUser.save()

        res.status(200).json(user)

    } catch (error) {
        throw error
    }
});


//POST route to login
const loginUser = asyncHandler(async (req, res) => {
    try {
        const { error, value } = await loginValidator(req.body, { abortEarly: false })
        if (error) {
            res.status(400).json(error.message)
        }
        const { email, password } = req.body;

        //check if user is registered 
        const regUser = await User.findOne({ email })
        if (!regUser) {
            res.status(400).json({ message: 'User is not registered' })
        }

        //compare password and grant access 
        if (regUser && await bcrypt.compare(password, regUser.password)) {
            const accessToken = jwt.sign({
                regUser: {
                    username: regUser.username,
                    email: regUser.email,
                    id: regUser.id
                }
            }, process.env.ACCESS_KEY,
                { expiresIn: '1yr' }
            )
            res.status(201).json(accessToken)
        } else {
            res.status(401).json({ message: 'email or password not correct' })
        }

    } catch (error) {
        throw error
    }
    res.status(200).json({ message: 'login users' })
});


//Verify otp
const verifyOtp = asyncHandler(async (req, res) => {
    try {
        const { error, value } = await otpValidation(req.body, { abortEarly: false })
        if (error) {
            res.status(400).json(error.message)
        }
        const { email, otp } = req.body;

        //check if the email match the email the otp was sent to
        const otpUser = await Otp.findOne({ email: email })
        if (!otpUser) {
            res.status(404).json({ message: 'the email you entered does not match the email the otp was sent to' })
        } 

        //if the otp user entered is correct
        const checkOtp = await Otp.findOne({ otp: otp })
        if (!checkOtp) {
            res.status(400).json({ message: 'the otp you entered is not correct' })
        }

        //if otp has expired
        if (checkOtp.expirationTime <= new Date()) {
            res.status(403).json({ message: 'the otp has expired' })
        }

        //find the user associated with the email provided
        const user = await User.findOne({ email })
        if (!user) {
            res.status(404).json({ message: 'user does not exist' })
        }

        //update the user record after the otp has been verified 
        checkOtp.verified = true,
            await checkOtp.save()

        //send welcome mail to the user
        await otpWelcomeMail(user.email, user.password)

        res.status(200).json({ message: 'otp verified successfully' })
    } catch (error) {
        throw error
    }
});

//Verify otp
const verifyOtpLink = asyncHandler(async (req, res) => {
    try {
        // const { error, value } = await otpValidation(req.body, { abortEarly: false })
        // if (error) {
        //     res.status(400).json(error.message)
        // }

        const { email, token } = req.query;

        //check if the email match the email the otp was sent to
        const otpUser = await Otp.findOne({ email: email })
        if (!otpUser) {
            res.status(404).json({ message: 'the email you entered does not match the email the otp was sent to' })
        } 
        
        //if the otp user entered is correct
        const checkOtp = await Otp.findOne({ otp: token })
        if (!checkOtp) {
            res.status(400).json({ message: 'the otp you entered is not correct' })
        }

        //if otp has expired
        if (checkOtp.expirationTime <= new Date()) {
            res.status(403).json({ message: 'the otp has expired' })
        }

        //find the user associated with the email provided
        const user = await User.findOne({ email })
        if (!user) {
            res.status(404).json({ message: 'user does not exist' })
        }

        //update the user record after the otp has been verified 
        checkOtp.verified = true,
            await checkOtp.save()

        //send welcome mail to the user
        await otpWelcomeMail(user.email, user.password)

        res.status(200).json({ message: 'otp verified successfully' })
    } catch (error) {
        throw error
    }
})

//resend otp
const resendOtp = asyncHandler(async(req, res) => {
    try {
        const { error, value } = await resendOtpValidation(req.body, { abortEarly: false })
        if(error) {
        res.status(400).json(error.message)
        }
        const { email } = req.body;

        //check if the user is registered 
        const reMail = await User.findOne({ email: email})
        if (!reMail) {
            res.status(404).json({ message: 'please check the email you entered' })
        }

        //generate new otp 
        const newOtp = generateOtp();

        //send the new otp code via mail
        await otpMail(email, newOtp, reMail.username)
        
        //set exipration time
        const expirationTime = new Date()
        expirationTime.setMinutes(expirationTime.getMinutes() + 5)

        //save the new OTP to Otp database
        const otpN = new Otp()
        otpN.email = reMail.email,
        otpN.otp = newOtp,
         otpN.expirationTime = expirationTime

        await otpN.save()

        res.status(200).json({ message: 'New otp reset'})

    } catch (error) {
        throw error
    }
});


//set password token
const resetPasswordToken = asyncHandler(async(req, res) => {
    try {
        const { error, value } = await passwordTokenValidation(req.body, { abortEarly: false })
         if(error) {
            res.status(400).json(error.message)
          }

         const { email } = req.body;

         //check if email is registered
         const passEmail = await User.findOne({ email: email})
         if(!passEmail) {
            res.status(404).json({ message: 'Email is not registered'})
         }

         //generate password token
         const passT = generateOtp()

         //verify
         passEmail.resentlink = passT,
         passEmail.isPasswordResentLinkSent = true

         //save to user database
         await passEmail.save()

         //send user to the user
         reSetPasswordMail(email, passT, passEmail.username)

         res.status(200).json({ message: 'Password reset token sent' })

    } catch (error) {
        throw error
    }
});

//change password
const changePassword = asyncHandler(async(req, res) => {
    try {
        const { error, value } = await changePasswordValidation(req.body, { abortEarly: false })
        if(error) {
            res.status(400).json(error.message)
        }

        const { email, oldPassword, newPassword } = req.body;

        //if user exists
        const user = await User.findOne({ email: email})
        if(!user) {
            res.status(404).json({ message: 'You are not are on the platform'})
        }

        //check if the password the user enters match the one on the database
        if (user && await bcrypt.compare(oldPassword, user.password)) {
            res.status(200).json({ message: 'password matches' })
        } else {
            res.status(401).json({ message: 'incorrect password'})
        }

        //hash new password
        const hashNew = await bcrypt.hash(newPassword, 10)

        //create new password 
        user.password = hashNew

        //save new password to the database
        await user.save()

        res.status(200).json({ message: 'password changed' })

    } catch (error) {
        throw error
    }
})
//Route to UPDATE a user 
const updateUser = asyncHandler(async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id,
            req.body,
            { new: true })
        if (!user) {
            res.status(404).json({ message: 'user id not correct' })
        }
    } catch (error) {
        throw error
    }
    res.status(200).json({ message: 'user updated' })
});

//Route to DELETE
const deleteuser = asyncHandler(async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)

    } catch (error) {
        throw error
    }
    res.status(200).json({ message: 'delete user' })
});

module.exports = {
    getUser,
    getUserId,
    createUser,
    createUserLink,
    loginUser,
    verifyOtp,
    verifyOtpLink,
    resendOtp,
    resetPasswordToken,
    changePassword,
    updateUser,
    deleteuser
}

