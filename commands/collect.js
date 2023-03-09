const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Members = require('../schemas/members')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('collect')
		.setDescription('Collect the money from your companys | You can buy companys with /buy'),
	
		async execute(interaction, client) 
    {
	    const userData = await Members.findOne({memberID: interaction.member.id})

        userData.inServer = true

        let difference = new Date() - userData.cooldowns.lastCollect;
        let timestamp_unlocked = Math.round(userData.cooldowns.lastCollect.getTime()/1000 + 6*60*60) // Add 6 hours to timestamp in seconds

        if(difference/1000/60/60 > 6) // 6 hours
        {
            let amount = userData.inventory.gasStation + userData.inventory.jeweler + userData.inventory.kiosk +  + userData.inventory.realEstate +  + userData.inventory.supermarket;

            if(amount > 0)
            {
                // Calculation earnings
                let hours_to_collect = difference/1000/60/60;
                let earning_kiosk = Math.round(userData.inventory.kiosk * hours_to_collect * 50)
                let earning_gasStation = Math.round(userData.inventory.gasStation * hours_to_collect * 100)
                let earning_supermarket = Math.round(userData.inventory.supermarket * hours_to_collect * 200)
                let earning_jeweler = Math.round(userData.inventory.jeweler * hours_to_collect * 300)
                let earning_realEstate = Math.round(userData.inventory.realEstate * hours_to_collect * 500)

                let earnings = earning_kiosk + earning_gasStation + earning_jeweler + earning_supermarket + earning_realEstate;
                userData.balance += earnings;
                userData.cooldowns.lastCollect = new Date();
                userData.save();

                let earning_message = new EmbedBuilder()
                .setColor('Gold')
                .setTitle(`You collected 🪙 ${earnings} Coins`)
                .setDescription(`${userData.inventory.kiosk}x kiosk -> 🪙 ${earning_kiosk} Coins\n
                ${userData.inventory.gasStation}x gas station -> 🪙 ${earning_gasStation} Coins\n
                ${userData.inventory.supermarket}x supermarket -> 🪙 ${earning_supermarket} Coins\n
                ${userData.inventory.jeweler}x jeweler -> 🪙 ${earning_jeweler} Coins\n
                ${userData.inventory.realEstate}x real estate -> 🪙 ${earning_realEstate} Coins`)
                .setTimestamp()
                interaction.reply({embeds: [earning_message], ephemeral: true})
            }else
            {
                let no_business = new EmbedBuilder()
                .setColor('Red')
                .setTitle('You dont have any business.')
                .setDescription(`You must buy a company at first. Try /buy`)
                .setTimestamp()
          
                interaction.reply({embeds: [no_business], ephemeral: true})
            }
        }else
        {
            let try_again = new EmbedBuilder()
            .setColor('Red')
            .setTitle('You collected your earnings already.')
            .setDescription(`You must wait some time before running the command again\nRemaining Time: <t:${timestamp_unlocked}>`)
            .setTimestamp()
      
            interaction.reply({embeds: [try_again], ephemeral: true})
        }
    }
};