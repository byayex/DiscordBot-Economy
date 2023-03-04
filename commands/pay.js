const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Members = require('../schemas/members')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pay')
		.setDescription('Pay a certain user!')
        .addUserOption(option => 
            option.setName('target')
            .setDescription('Please select the user you want to pay')
            .setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount')
            .setDescription('How many coins do you want to send?')
            .setMinValue(1)
            .setRequired(true)),
	
		async execute(interaction, client) 
    {
        const target = interaction.options.getUser('target');
        const amount = interaction.options.getInteger('amount');

		const userData = await Members.findOne({memberID: interaction.member.id})
        
        const targetData = await Members.findOne({memberID: target.id})

        if(!targetData)
        {
            let emb = new EmbedBuilder()
            .setTitle('This member was never active.')
            .setDescription('The target must have written a message at least once\nPlease tell the recipient to send a message.')
            .setColor('Red')
            .setTimestamp()
            return interaction.reply({embeds: [emb], ephemeral: true})
        }

        userData.inServer = true
        targetData.inServer = true;

        if(target.id == interaction.member.id)
        {
            let same_person = new EmbedBuilder()
            .setColor('Red')
            .setTitle('You cant send coins to yourself!')
            .setDescription('Please use another target.')
            .setTimestamp()
            return interaction.reply({embeds: [same_person], ephemeral: true})
        }

        if(userData.balance >= amount)
        {
            userData.balance -= amount;
            targetData.balance += amount;
            let sent_coins = new EmbedBuilder()
            .setColor('Blue')
            .setTitle(`You sent 🪙 ${amount} Coins to "${target.tag}"`)
            .setDescription(`** Your new balance is 🪙 ${userData.balance} Coins**`)
            .setTimestamp()
            interaction.reply({embeds: [sent_coins], ephemeral: true})
            const log_channel = interaction.guild.channels.cache.find(channel => channel.id == client.config.coin_logs_id);
            if(log_channel)
            {
                let log = new EmbedBuilder()
                .setColor('Blue')
                .setTitle(`"${interaction.user.tag}" sent coins to "${target.tag}"`)
                .setDescription(`Amount: 🪙 ${amount} Coins`)
                .setTimestamp();
                log_channel.send({embeds: [log]})
            }
        }else
        {
            let not_enough_coins = new EmbedBuilder()
            .setColor('Red')
            .setTitle('You dont have enough coins!')
            .setDescription(`** You only have 🪙 ${userData.balance} Coins**`)
            .setTimestamp()
            interaction.reply({embeds: [not_enough_coins], ephemeral: true})
        }
        userData.save()
        targetData.save()
    }
};