const fs = require('fs');
const Discord = require("discord.js");
const {Client, GatewayIntentBits, Collection} = require('discord.js');
const {registerCommands} = require('./deploy-commands');
const {loadConfig} = require('./managers/configManager')
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages]});

client.commands = new Collection();
client.events = new Discord.Collection();
client.config = loadConfig();
client.verifyprocess = new Map()
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for(const file of commandFiles)
{
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

['event_handler'].forEach(handler=>{
    require(`./handlers/${handler}`)(client, Discord);
})

client.login(process.env.TOKEN);

registerCommands();

process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});