module.exports = (Discord, client) => {
        console.log('StartUp -> ' + 'Bot - Account: ' + client.user.tag);
        
        const mongoose = require('mongoose')
        require('dotenv').config();
        mongoose.set("strictQuery", false);
        mongoose.connect(process.env.MONGO_URL, {
                keepAlive: true
        }).then(() => console.log('StartUp -> Database is connected!')).catch((err) => console.log(err))
}
