const db = require('./db')
const helpres = require('./helpers')
setInterval(() => {
	db.getSearches()
	.then((ratings) => {
		console.log(ratings.rows);
		ratings.rows.forEach(user => {
			let elements = []
			let promises = []
			user.clicked.forEach((restaurant) => {
				promises.push(model.getRestaurant(restaurant.id))
			})
			Promise.all(promises).then(restaurants => {
				let elements = []
				restaurants.forEach(restaurant => {
					elements.push({
						title: restaurant.name,
						image_url: restaurant.thumb,
						buttons: [
							{
								type: 'postback',
								title: 'Tady jsem byl',
								payload: JSON.stringify({action: 'visited', restaurant: {id: restaurant.id}})
							}
						]
					})
				})
				return elements
			}).then(elements => {
				helpers.callSendAPI({
					recipient: {
						id: user.id
					},
					message: {
						attachment: {
							type: 'template',
							payload: {
								template_type: 'generic',
								elements
							}
						}
					}
				})
			}).catch(e => console.log(e))


		})
	}).catch(e => console.log(e))
}, 1000)
