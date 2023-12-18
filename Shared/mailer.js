const mail = require('../Service/mailer.service')

const otpMail = async(email, verificationCode, username) => {
    const subject = 'Email verification'
    const body = `<!DOCTYPE HTML>
    <html>
    <head>
    </head>
    <body>
    <h1>OTP Verification</h1>
    <h1>Hello ${username}</h1>
    <h1> Your One Time Password (OTP): ${verificationCode}</h1>
    <P> This password is for a limited time</P>
    <p> If you did not request for OTP kindly ignore this message, your account is safe with us</p>
    </body>
    </html>
    `
    await mail.mailService.sendEmail(email, subject, body)
}

const otpWelcomeMail = async(email, verificationCode, username) => {
    const subject = 'OTP Verification'
    const body = `<!DOCTYPE HTML>
    <html>
    <head>
    </head>
    <body>
    <h1>OTP Verification</h1>
    <h1>Hello ${username}</h1>
    <h1> Your One Time Password (OTP): ${verificationCode}</h1>
    <P> This password is for a limited time</P>
    <p> If you did not request for OTP kindly ignore this message, your account is safe with us</p>
    </body>
    </html>
    `
    await mail.mailService.sendEmail(email, subject, body)
}

const reSetPasswordMail = async(email, verificationCode, username) => {
    const subject = 'Resent password'
    const body = `<!DOCTYPE HTML>
    <html>
    <head>
    </head>
    <body>
    <h1>OTP Verification</h1>
    <h1>Hello ${username}</h1>
    <h1> Your One Time Password (OTP): ${verificationCode}</h1>
    <P> This password is for a limited time</P>
    <p> If you did not request for OTP kindly ignore this message, your account is safe with us</p>
    </body>
    </html>
    `
    await mail.mailService.sendEmail(email, subject, body)
}

module.exports = {
    otpMail,
    otpWelcomeMail,
    reSetPasswordMail
}