module.exports = class Model {
	get (lat, lon) {
		return new Promise(function(resolve, reject) {
			require('https').get({
				protocol: 'https:',
				hostname: 'developers.zomato.com',
				path: `/api/v2.1/search?lat=${lat}&lon=${lon}&radius=1000&q=Gluten-free&count=10`,
				headers: {
					'user-key': process.env.ZOMATO_API_KEY,
					'Accept': 'application/json'
				}
			}, res => {
				res.setEncoding('utf8')
				let dataArr = []
				res.on('data', data => dataArr.push(data))
				res.on('end', () => {
					let json = JSON.parse(dataArr.join(''))['restaurants']
					let response = []
					json.forEach(item => {
						response.push(item.restaurant)
					})
					resolve(response)
				})
			}).on('error', e => {
				console.log('Chyba modelu:')
				console.log(e.message)
				console.log(e)
				reject()
			})
		})
	}
	getRestaurant (id) {
		return new Promise(function(resolve, reject) {
			require('https').get({
				hostname: 'developers.zomato.com',
				path: '/api/v2.1/restaurant',
				headers: {
					'user-key': process.env.ZOMATO_API_KEY,
					'Accept': 'application/json'
				}
			}, res => {
				res.setEncoding('utf8')
				let dataArr = []
				res.on('data', data => dataArr.push(data))
				res.on('end', () => {
					let response = JSON.parse(dataArr.join(''))
					resolve(response)
				}).on('error', () => reject())
			})
		})
	}
}
