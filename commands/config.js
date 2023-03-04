const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const {setConfig} = require('../managers/configManager')
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('config')
		.setDescription('Shows and edits the config.')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.addSubcommand(subcommand =>
			subcommand
				.setName('show')
				.setDescription('Shows all Settings!'))
		.addSubcommand(subcommand =>
			subcommand
				.setName("set")
				.setDescription('Sets an setting to the specific value')
			.addIntegerOption(option =>
				option.setName('settingsnumber')
				.setDescription('Please type in the number of the setting (example: verifyid is 1)')
				.setRequired(true)
				.setMinValue(1)
				.setMaxValue(2))
			.addStringOption(option =>
				option.setName('newvalue')
				.setDescription('Please type in the new value for the setting')
				.setRequired(true))),
	
		async execute(interaction, client) 
    {
		switch(interaction.options.getSubcommand())
		{
			case "show":
				{
					let all = new EmbedBuilder()
					.setColor('Blue')
					.setTitle("All Settings:")
					.setDescription("Only change settings if you know exactly what they do!")
					.setTimestamp()

					all.addFields({name: "1. verifyid", value: client.config.verifyid},
					{name: "2. coin_logs_id", value: client.config.coin_logs_id})


					interaction.reply({embeds: [all], ephemeral: true})
					break;
				}
			case "set":
				{
					const settingsnmb = interaction.options.getInteger('settingsnumber');
					const nwvalue = interaction.options.getString('newvalue');
					
					let newsettings = new EmbedBuilder()
					.setColor('Blue')
					.setTitle("Following Settings got changed: ")
					.setTimestamp()

					switch(settingsnmb)
					{
						case 1:
							{
								client.config.verifyid = nwvalue
								setConfig(client.config)
								newsettings.addFields({name: "1. verifyid got changed to", value: "**"+client.config.verifyid+"**"})

								interaction.reply({embeds: [newsettings], ephemeral: true})
								break;
							}
						case 2:
							{
								client.config.coin_logs_id = nwvalue
								setConfig(client.config)
								newsettings.addFields({name: "2. coin_logs_id got changed to", value: "**"+client.config.coin_logs_id+"**"})

								interaction.reply({embeds: [newsettings], ephemeral: true})
								break;
							}	
					}
				}
		}
    }
};