const Members = require('../../schemas/members')
const {returnXPGain} = require('../../managers/levelManager')

module.exports = async (Discord, client, message) =>
{
    if(message.author.bot) return;

    const userData = await Members.findOne({memberID: message.member.id}) || await Members.create({
        memberID: message.member.id,
        balance: 0,
        exp: 1,
        inServer: true,
        cooldowns: {
            baltop: new Date('2000-01-01T00:00:00'),
            lastMessage: new Date('2000-01-01T00:00:00'),
            rob: new Date('2000-01-01T00:00:00'),
            gotRobbed: new Date('2000-01-01T00:00:00')
        }
    })

    let difference = new Date() - userData.cooldowns.lastMessage;
    
    if(difference/1000 > 7)
    {
        userData.exp = userData.exp + returnXPGain()
        userData.cooldowns.lastMessage = new Date()
        userData.save()
    }
}
