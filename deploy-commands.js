function registerCommands()
{
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config();
const fs = require('fs');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const clientId = process.env.CLIENT_ID;
const dev_guild = process.env.GUILD_ID_FOR_DEV_MODE;
const modus = process.env.CMD_MODE;

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		if (modus === 'GLOBAL') // ON EVERY GUILD (1h)
		{
			console.log('Reloading Globally!')
			await rest.put(
				Routes.applicationCommands(clientId),
				{ body: commands },
			);
		}
		if (modus === 'DEV') // ONLY ON CERTAIN GUILD (INSTANT)
		{
			console.log('Reloading on the Developer-Server!')
			await rest.put(
				Routes.applicationGuildCommands(clientId, dev_guild),
				{ body: commands },
			);
		}

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();
}

module.exports = {registerCommands}
