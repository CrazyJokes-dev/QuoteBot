const { SlashCommandBuilder } = require('discord.js');
const Quote = require("../schemas/quotes.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('somequote')
		.setDescription('This gives you what a certain person has said out of context haha >:)')
		.addStringOption((author) =>
			author.setName('author')
				.setDescription('The name of the person who has said forbidden words')
				.setRequired(true),
		),

	async execute(interaction) {
		const { quotes } =
			interaction.db ??
			(await Quote.findOneAndUpdate(
				{ _id: interaction.guild.id },
				{},
				{ upsert: true, new: true },
			));

		const list = [ ];
		for (let i = 0; i < quotes.length; i++) {
			if (quotes[i].author.toLowerCase() === interaction.options.getString("author").toLowerCase()) {
				list.push(quotes[i]);
			}
		}

		if (!list.length) {
			return await interaction.reply(`${interaction.options.getString("author")}` + " hasn't said anything bad out of context yet! Please try again we they do!");
		}

		const randNum = Math.ceil(Math.random() * list.length);
		const randomQuote = list[ randNum - 1];


		await interaction.reply('"' + randomQuote.text + '" -' + `${randomQuote.author}`);
	},
};