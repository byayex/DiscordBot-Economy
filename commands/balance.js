const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Members = require('../schemas/members')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('balance')
		.setDescription('Shows your current balance!'),
	
		async execute(interaction, client) 
    {
		  const userData = await Members.findOne({memberID: interaction.member.id})

      userData.inServer = true
      userData.save()

      let current_balance = new EmbedBuilder()
      .setColor('Gold')
      .setTitle('Your current Balance:')
      .setDescription(`** 🪙 ${userData.balance} Coins**`)
      .setTimestamp()

      interaction.reply({embeds: [current_balance], ephemeral: true})
    }
};