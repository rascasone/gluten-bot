const helpers = require('../helpers')
module.exports = function (event, json) {
	helpers.sendTextMessage(event.sender.id, "Oops, please type in the address in a different way. Or share you location with us (there is a button for it somewhere around).");
}
