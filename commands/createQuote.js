const { SlashCommandBuilder } = require('discord.js');
const Quote = require("../schemas/quotes.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('createquote')
		.setDescription('This logs every single cursed and forbidden quote you wish to record. No more, no less.')
		.addStringOption((option) =>
			option.setName('quote')
				.setDescription('The quote to be recorded in the history books for all to see')
				.setRequired(true),
		)
		.addStringOption((author) =>
			author.setName('author')
				.setDescription('The name of the person who has said forbidden words')
				.setRequired(true),
		),
	async execute(interaction) {
		const guild =
			interaction.db ??
			(await Quote.findOneAndUpdate(
				{ _id: interaction.guild.id },
				{},
				{ upsert: true, new: true },
			));

		const serverQuotes = guild.quotes;

		const text = interaction.options.getString("quote");
		const author = interaction.options.getString("author");

		await serverQuotes.push({
			text,
			author,
			authorID: interaction.user.id,
		});

		await guild.save();

		await interaction.reply('"' + text + '" -' + author);
	},
};