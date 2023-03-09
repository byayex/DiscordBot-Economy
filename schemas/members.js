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
        gotRobbed: Date,
        lastCollect: Date
    },
    inventory: {
        kiosk: Number,
        gasStation: Number,
        supermarket: Number,
        jeweler: Number,
        realEstate: Number
    }
})

module.exports = model('Members', Members)