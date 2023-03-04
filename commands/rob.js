const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Members = require('../schemas/members')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rob')
		.setDescription('Robs a person!')
        .addUserOption(option => 
            option.setName('target')
            .setDescription('Please select the user you want to rob')
            .setRequired(true)),
	
		async execute(interaction, client) 
    {
        const target = interaction.options.getUser('target');

        const targetData = await Members.findOne({memberID: target.id})
        const userData = await Members.findOne({memberID: interaction.member.id})


        let difference_to_rob = new Date() - userData.cooldowns.rob;
        let difference_got_robbed = new Date() - targetData.cooldowns.gotRobbed;
        let timestamp_unlocked = Math.round(userData.cooldowns.rob.getTime()/1000 + 60*60) // Calculating in Seconds and add the 60 minutes
        let timestamp_unlocked_got_robbed = Math.round(userData.cooldowns.rob.getTime()/1000 + 90*60) // Calculating in Seconds and add the 90 minutes

        if(difference_to_rob/1000/60 > 60) // 60 minutes
        {
            if(!targetData)
            {
                let emb = new EmbedBuilder()
                .setTitle('This member was never active.')
                .setDescription('The target must have written a message at least once.')
                .setColor('Red')
                .setTimestamp()
                return interaction.reply({embeds: [emb], ephemeral: true})
            }
            if(difference_got_robbed/1000/60 < 90)
            {
                let emb = new EmbedBuilder()
                .setTitle('The target got recently robbed!')
                .setDescription(`You cannot rob this person for a while.\nRemaining Time: <t:${timestamp_unlocked_got_robbed}>`)
                .setColor('Red')
                .setTimestamp()
                return interaction.reply({embeds: [emb], ephemeral: true})
            }

            userData.inServer = true
            targetData.inServer = true;

            let amount_robbed = Math.floor(Math.random() * (101 - 25) + 25);
            userData.balance += amount_robbed;
            targetData.cooldowns.gotRobbed = new Date()
            userData.cooldowns.rob = new Date()

            let emb = new EmbedBuilder()
            .setColor('Blue')
            .setTitle(`You robbed "${target.tag}"`)
            .setDescription(`Earnings: ${amount_robbed}`)
            .setTimestamp()
            interaction.reply({embeds: [emb], ephemeral: true})
        }else
        {
            let emb = new EmbedBuilder()
            .setColor('Blue')
            .setTitle('Please wait.')
            .setDescription(`You must wait some time before running the command again\nRemaining Time: <t:${timestamp_unlocked}>`)
            .setTimestamp()
            interaction.reply({embeds: [emb], ephemeral: true})
        }
        userData.save()
        targetData.save()
    }
};