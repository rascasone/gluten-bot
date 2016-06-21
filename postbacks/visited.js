const helpers = require('../helpers')
module.exports = function (event, json) {
	helpers.callSendAPI({
		recipient: {
			id: event.sender.id
		},
		message: {
			attachment: {
				type: 'template',
				payload: {
					template_type: 'button',
					text: 'Jak si poradili s bezlepkem?',
					buttons: [
						{
							type: 'postback',
							title: 'Výborně',
							payload: JSON.stringify({action: 'rating', restaurant: json.restaurant, rating: 3})
						},
						{
							type: 'postback',
							title: 'Šlo to',
							payload: JSON.stringify({action: 'rating', restaurant: json.restaurant, rating: 2})
						},
						{
							type: 'postback',
							title: 'Vůbec ne',
							payload: JSON.stringify({action: 'rating', restaurant: json.restaurant, rating: 1})
						}
					]
				}
			}
		}
	})
}
