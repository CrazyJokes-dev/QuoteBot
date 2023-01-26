const auth = require('./auth.json');
const fs = require('node:fs');
const path = require('node:path');
const mongoose = require("mongoose");
mongoose.set('strictQuery', true);

const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');


// Create an instance of a Discord client

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});

client.commands = new Collection();

// Next, using the modules imported above, dynamically retrieve your command files with a few more additions to the bot.js file:
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	}
	else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
	console.log('I am ready!');
});

// This handles ONLY SLASH commands
client.on(Events.InteractionCreate, async interaction => {
	// isChatInputCommand() makes sure to exit out of this if another command type (different prefix to my knowledge) is encountered
	if (!interaction.isChatInputCommand()) return;
	// console.log(interaction);

	// This logs which member and what command they used
	console.log("'" + interaction.user.username + "#" + interaction.user.discriminator + "' has used '" + interaction.commandName + "'");

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	}
	catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// This handles custom non-slash commands
client.on('messageCreate', message => {
	if (message.author.bot) return;
	// This is where we'll put our code.
	if (message.content.indexOf(auth.prefix) !== 0) return;

	const args = message.content.slice(auth.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	if (command === 'ping') {
		message.channel.send('Pong!');
	}
	else

	if (command === 'blah') {
		message.channel.send('Meh.');
	}
});

// Create an event listener for new guild members
client.on('guildMemberAdd', (member) => {
	console.log(`New User "${member.user.username}" has joined "${member.guild}"`);
	const channel = member.guild.channels.cache.find(ch => ch.name === 'newtown' || ch.name === 'welcome' || ch.name === '🖐🏽welcome🖐🏽' || ch.name === 'general');
	if (member.user.id === '300587092235255809') {
		channel.send(`${member} has joined this server`);
		channel.send('Please leave');

	}
	else if (member.user.id === '434081005289078796') {
		channel.send(`${member} has joined this server`);
		channel.send('oh GOD. it\'s *HIM*');

	}
	else if (member.user.id === '318200323133145089') {
		channel.send(`${member} has joined this server`);
		channel.send('YAY! it\'s Rex :D');

	}
	else if (member.user.id === '652664638449647646') {
		channel.send(`${member} has joined this server`);
		channel.send('I\'m in the street.');

	}
	else if (member.user.id === '232100744830910464') {
		channel.send(`${member} has joined this server`);
		channel.send('**GOD** has entered your realm. Prepare for the apocalypse');


	}
	else {
		channel.send(`${member} has joined this server`);
	}


});

(async () => {
	await mongoose.connect(auth.mongoPath);
})();
mongoose.connection.on("connected", () => console.log("Connected to mongoDB"));

// Must be using git bash in order for SIGINT to activate
process.on("SIGINT", async () => {
	mongoose.connection.close(() => {
		console.log("Closed mongoDB connection");
		client.destroy();
		console.log("Destroyed client");
		process.exit(0);
	});
});

// Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login(auth.token);