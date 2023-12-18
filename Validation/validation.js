const Joi = require('joi')

const validator = (schema) => (payload) => 
schema.validate(payload, { abortEarly: false })

//signup 
const signupValidation = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(16).required()
});

//login
const loginValidator = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(16).required()
});

//verify otp
const otpValidation = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().min(6).max(6).required()
});

//resend otp
const resendOtpValidation = Joi.object({
    email: Joi.string().email().required(),
});

//sent password token
const passwordTokenValidation = Joi.object({
    email: Joi.string().email().required()
});

//change password
const changePasswordValidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(16).required(),
    newPassword: Joi.string().min(8).max(16).required()
});

exports.signupValidation = validator(signupValidation)
exports.loginValidator = validator(loginValidator)
exports.otpValidation = validator(otpValidation)
exports.resendOtpValidation = validator(resendOtpValidation)
exports.passwordTokenValidation = validator(passwordTokenValidation)
exports.changePasswordValidation = validator(changePasswordValidation)
