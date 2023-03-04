const { model, Schema } = require('mongoose')

let Members = new Schema({
    memberID: String,
    balance: Number,
    exp: Number,
    inServer: Boolean,
    cooldowns: {
        baltop: Date,
        lastMessage: Date,
        rob: Date,
        gotRobbed: Date
    },
    inventory: {

    }
})

module.exports = model('Members', Members)