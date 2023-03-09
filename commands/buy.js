const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Members = require('../schemas/members')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('buy')
		.setDescription('Buy your own business to earn Coins')
        .addStringOption(option => 
            option.setName('type')
            .setDescription('Please select the business you want to buy')
            .setRequired(true)
            .addChoices(
                {name: 'Show all companys and their statistics', value: 'statistics'},
                {name: 'kiosk', value: 'kiosk'},
                {name: 'gas station', value: 'gasStation'},
                {name: 'supermarket', value: 'supermarket'},
                {name: 'jeweler', value: 'jeweler'},
                {name: 'realEstate', value: 'realEstate'})),
	
		async execute(interaction, client) 
    {
        const type = interaction.options.getString('type');

		const userData = await Members.findOne({memberID: interaction.member.id})

        userData.inServer = true

        let price = 0
        switch(type)
        {
            case "kiosk":
                {
                    price = 5000
                    break;
                }
            case "gasStation":
                {
                    price = 10000
                    break;
                }    
            case "supermarket":
                {
                    price = 20000    
                    break;
                }  
            case "jeweler":
                {
                    price = 30000  
                    break;
                }
            case "realEstate":
                {
                    price = 50000
                    break;
                }
            case "statistics":
                {
                    break;
                } 
        }

        if(userData.balance >= price)
        {
            userData.balance -= price;
            switch(type)
            {
                case "kiosk":
                    {
                        userData.inventory.kiosk += 1
                        break;
                    }
                case "gasStation":
                    {
                        userData.inventory.gasStation += 1
                        break;
                    }    
                case "supermarket":
                    { 
                        userData.inventory.supermarket += 1
                        break;
                    }  
                case "jeweler":
                    {
                        userData.inventory.jeweler += 1
                        break;
                    }
                case "realEstate":
                    {
                        userData.inventory.realEstate += 1
                        break;
                    }
                case "statistics":
                    {
                        let stats = new EmbedBuilder()
                        .setColor('Gold')
                        .setTitle('Earnings of the companys!')
                        .setDescription(`1x kiosk - 50 coins per hour\n
                        1x gas station - 100 coins per hour\n
                        1x supermarket - 200 coins per hour\n
                        1x jeweler - 300 coins per hour\n
                        1x real estate - 500 coins per hour`)
                        .setTimestamp()
                        return interaction.reply({embeds: [stats], ephemeral: true});
                    } 
            }
            let you_bought = new EmbedBuilder()
                .setColor('Gold')
                .setTitle('You bought a business!')
                .setDescription(`** You got 1x ${type}**`)
                .setTimestamp()
            interaction.reply({embeds: [you_bought], ephemeral: true})
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
    }
};