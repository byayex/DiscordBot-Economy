const Members = require('../../schemas/members')
const {returnXPGain} = require('../../managers/levelManager')

module.exports = async (Discord, client, message) =>
{
    if(message.author.bot) return;

    const userData = await Members.findOne({memberID: message.member.id})

    let difference = new Date() - userData.cooldowns.lastMessage;
    
    if(difference/1000 > 7)
    {
        userData.exp = userData.exp + returnXPGain()
        userData.cooldowns.lastMessage = new Date()
        userData.save()
    }
}
