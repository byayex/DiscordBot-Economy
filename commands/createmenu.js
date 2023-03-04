const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('createmenu')
		.setDescription('Creates the selected Menu!')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.addStringOption(option =>
			option.setName('menu')
			.setDescription('Which menu should be created?')
			.setRequired(true)
			.setChoices({name: "verify", value: "verify"})),
	
		async execute(interaction, client) 
    {
		const menu = interaction.options.getString('menu');

		switch(menu)
		{
			case 'verify':
				{
					const embed = new EmbedBuilder()
					.setColor('Green')
					.setTitle('Please verify yourself!')
					.setDescription('**Use the Button below to start the verification process.**')
					const row = new ActionRowBuilder()
						.addComponents(
							new ButtonBuilder()
								.setCustomId('verify')
								.setLabel('Verify')
								.setStyle(ButtonStyle.Primary)
								.setEmoji('✅'),
						);
					interaction.channel.send({embeds: [embed], components: [row]})
					interaction.reply({content: "Created verify menu!", ephemeral: true})
					break;
				}
		}
    }
};