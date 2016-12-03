/**
 * COMP2068 - Group Presentation
 * account.js
 * 
 * @author Takaaki Goto
 */
var mongoose = require('mongoose');

// reference passort-local-mongoose so passport can use this model for user authentication
var plm = require('passport-local-mongoose');

// define the class using a mongoose schema
var AccountSchema = new mongoose.Schema({
	// 0: offline, 1: online, 2: away
	onlineStatus: Number
});

AccountSchema.plugin(plm);

// make the class definition public as "Account"
module.exports = mongoose.model('Account', AccountSchema);
