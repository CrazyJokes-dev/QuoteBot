const mongoose = require("mongoose");

const QuoteSchema = new mongoose.Schema({
	_id: {
		type: String,
		required: true,
	},
	quotes: [
		{
			text: {
				type: String,
				required: true,
			},
			author: {
				type: String,
				required: true,
			},
			quoterID: String,
			ogMessageID: String,
			ogChannelID: String,
			createdTimestamp: {
				type: Number,
				min: 0,
				default: Date.now,
			},
		},
	],
});

const QuoteModel = mongoose.model("all_quote", QuoteSchema);
module.exports = QuoteModel;