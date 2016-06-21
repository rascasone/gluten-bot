const helpers = require('../helpers')
const db = require('../db')
module.exports = function (event, json) {
	helpers.sendTextMessage('Díky za hodnocení.')
	db.postRating(json.restaurant.id, json.rating)
}
