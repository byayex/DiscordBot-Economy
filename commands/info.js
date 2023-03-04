const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Members = require('../schemas/members');
const {returnLevel,returnXPNeeded} = require('../managers/levelManager');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('Shows informations about you!'),
	
		async execute(interaction, client) 
    {
        const userData = await Members.findOne({memberID: interaction.member.id})
        userData.inServer = true
        userData.save()

        let current_level = returnLevel(userData.exp);
        let xp_needed = Math.round(returnXPNeeded(current_level+1)-userData.exp);

        let last_message_string = `<t:${Math.floor(userData.cooldowns.lastMessage.getTime()/1000)}>`;
        
        if(userData.cooldowns.lastMessage.getTime() <= new Date('2000-01-01T00:00:00').getTime())
        {
            last_message_string = 'You never sent a message.'
        }

        let emb = new EmbedBuilder()
        .setTitle(`Info: **${interaction.user.tag}**`)
        .setColor('Blue')
        .setTimestamp()
        .setThumbnail(interaction.member.displayAvatarURL())
        .addFields({name: "Current Level:", value: `${current_level}`}, {name: "XP needed for next Level:", value: `${xp_needed}`},
        {name: "Last Message:", value: last_message_string})

        interaction.reply({embeds: [emb], ephemeral: true})
    }
};