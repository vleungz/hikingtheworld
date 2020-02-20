var mongoose = require("mongoose");

var hikeSchema = new mongoose.Schema({
	name: String,
	country: String,
	rating: Number,
	image: String,
	info: String,
	description: String,
	location: String,
	lat: Number,
	lng: Number,
	author:{
		id:{
			type: mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username:String
	},
	comments:[
		{
			type: mongoose.Schema.Types.ObjectId,
			ref:"Comment"
		}
	]
});

module.exports = mongoose.model("Hike", hikeSchema);