const { SlashCommandBuilder } = require('discord.js');
const Quote = require("../schemas/quotes.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('randomquote')
		.setDescription('Gives you some fuel to blackmail someone with what they said out of context....'),

	async execute(interaction) {
		const { quotes } =
			interaction.db ??
			(await Quote.findOneAndUpdate(
				{ _id: interaction.guild.id },
				{},
				{ upsert: true, new: true },
			));

		const randNum = Math.ceil(Math.random() * quotes.length);
		const randomQuote = quotes[ randNum - 1];


		await interaction.reply('"' + randomQuote.text + '" -' + `${randomQuote.author}`);
	},
};