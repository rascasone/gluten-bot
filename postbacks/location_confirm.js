const helpers = require('../helpers')
module.exports = function (event, json) {
	helpers.sendRestaurants(event.sender.id, json.latitude, json.longitude)
}
