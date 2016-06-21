const request = require('request')
const geolib = require('geolib')
const db = require('./db')
const Model = require('./model')
let model = new Model

module.exports.sendTextMessage = function (recipientID, msg) {
    module.exports.callSendAPI({
        recipient: {
            id: recipientID
        },
        message: {
            text: msg
        }
    })
}

/*
* Call the Send API. The message data goes in the body. If successful, we'll
* get the message id in a response
*
*/
module.exports.callSendAPI = function (messageData) {
    request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: process.env.MESSENGER_PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: messageData

    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var recipientId = body.recipient_id;
            var messageId = body.message_id;

            // console.log("Successfully sent generic message with id %s to recipient %s",
            // messageId, recipientId);
        } else {
            console.error("Unable to send message.");
            console.error(`Status code: ${response.statusCode}`);
            console.error(response);
            console.error(error);
        }
    });
}

module.exports.loggingUrl = function (url, restaurantId, userId) {
    return 'https://msg-test.herokuapp.com/link?restaurantId=' + restaurantId + '&userId=' + userId + '&href=' + url
}

module.exports.sendRestaurants = function (senderId, latitude, longitude) {
    model.get(latitude, longitude)
    .then((restaurants) => {
        if (restaurants && restaurants.length > 0) {
            var messageData = {
                recipient: {
                    id: senderId
                },
                message: {
                    attachment: {
                        type: "template",
                        payload: {
                            template_type: "generic",
                            elements: []
                        }
                    }
                }
            }
            restaurants.forEach(rest => {
                db.createRestaurant(rest.id)
                messageData.message.attachment.payload.elements.push({
                    title: rest.name,
                    image_url: rest.thumb,
                    subtitle: '' + geolib.getDistance({
                        latitude: latitude,
                        longitude: longitude
                    }, {
                        latitude: rest.location.latitude,
                        longitude: rest.location.longitude
                    }) + ' m od vás; ' + rest.location.address,
                    buttons: [
                        {
                            type: "web_url",
                            title: "Zjistit více",
                            url: module.exports.loggingUrl(rest.url, rest.id, senderId)
                        }
                    ]
                })
            })
            module.exports.callSendAPI(messageData);
            db.search(senderId).catch((e) => {
                console.log(e);
            })
        } else {
            module.exports.sendTextMessage(senderId, "No \"Gluten-free\" restaurants found. Please type in another address.");
        }
    })
    .catch(e => {
        console.log(e)
        module.exports.sendTextMessage(senderId, "Oops! Something's wrong..");
        setTimeout(() => {
            module.exports.sendTextMessage(senderId, "And I think it ain't me...");
        }, 3000)
    })
}
