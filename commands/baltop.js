const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Members = require('../schemas/members')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('baltop')
		.setDescription('Shows 15 richest members!'),
	
		async execute(interaction, client) 
    {
        const userData = await Members.findOne({memberID: interaction.member.id})

        let difference = new Date() - userData.cooldowns.baltop;
        let timestamp_unlocked = Math.round(userData.cooldowns.baltop.getTime()/1000 + 60*15) // Calculating in Seconds and add the 15 minutes

        if(difference/1000/60 > 15) // 15 minutes
        {
            const userDatas = await Members.find({inServer: true});

            const allUsersFormatted = []
    
            for (let i = 0; i < userDatas.length; i++) 
            {
                try
                {
                    let fetched_mem = await interaction.guild.members.fetch(userDatas[i].memberID)
    
                    if(fetched_mem)
                    {
                        allUsersFormatted.push({id: userDatas[i].memberID, balance: userDatas[i].balance})
                    }
                }catch(err) {}
            }
            let sortedUsers = allUsersFormatted.sort((a,b) => {
                return (b.balance-a.balance)
            }).slice(0,15)
    
            let desc_string = ''
            sortedUsers.map((user, index) => {
                desc_string += `** [ ${index+1} ] : <@${user.id}> : 🪙 ${user.balance} Coins**\n`
            })
    
            let current_balance = new EmbedBuilder()
            .setColor('Gold')
            .setTitle('**Leaderboard | Top 15**')
            .setDescription(desc_string)
            .setTimestamp()
    
            interaction.reply({embeds: [current_balance], ephemeral: true})
            userData.cooldowns.baltop = new Date()
            userData.save()
        }else
        {
            let emb = new EmbedBuilder()
            .setColor('Blue')
            .setTitle('Please wait.')
            .setDescription(`You must wait some time before running the command again\nRemaining Time: <t:${timestamp_unlocked}>`)
            .setTimestamp()
            interaction.reply({embeds: [emb], ephemeral: true})
        }
    }
};