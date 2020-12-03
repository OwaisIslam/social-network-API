const { Schema } = require("mongoose");
const dateFormat = require("../utils/dateFormat");

const ReactionSchema = new Schema(
	{
		reactionId: {
			type: Schema.Types.ObjectId,
			default: () => newTypes.ObjectId(),
		},
		reactionBody: {
			type: String,
			required: true,
			trim: true,
			minlength: 1,
			maxlength: 280,
		},
		username: {
			type: String,
			required: true,
			trim: true,
		},
		createdAt: {
			type: Date,
			default: Date.now,
			get: (createdAtVal) => dateFormat(createdAtVal),
		},
	},
	{
		toJSON: {
			getters: true,
		},
	}
);

module.exports = ReactionSchema;