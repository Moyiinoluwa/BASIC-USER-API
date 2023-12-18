const mongoose = require('mongoose')

const otpSchema = mongoose.Schema({
    otp: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    expirationTime: {
        type: Date,
        required: true,
    }, 

    verified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
})


module.exports = mongoose.model('Otp', otpSchema)