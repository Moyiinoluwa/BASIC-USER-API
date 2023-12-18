const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unqiue: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    isLoggedIn: {
        type: Boolean,
        default: false
    },
    
    isLoggedOut: {
        type: Boolean,
        default: false
    },

    isPasswordResentLinkSent: {
        type: Boolean,
        default: false
    },

    resentLink: {
        type: String
    },

}, {
    timestamps: true,
})

module.exports = mongoose.model('User', userSchema)