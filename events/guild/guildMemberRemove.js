const Members = require('../../schemas/members')

module.exports = async (Discord, client, member) =>
{
    if(member.user.bot) return;

    const userData = await Members.findOne({memberID: member.id})

    if(userData)
    {
        userData.inServer = false
        userData.save()
    }
}
