const db = require('./db')
const helpers = require('./helpers')
const geocoder = require('./geocoder')
const Model = require('./model')
let model = new Model

// Handeling message calls
// https://developers.facebook.com/docs/messenger-platform/webhook-reference#received_message
module.exports.message = function (event) {
    let senderID = event.sender.id;
    let recipientID = event.recipient.id;
    let timeOfMessage = event.timestamp;
    let message = event.message;

    var messageId = message.mid;

    // You may get a text or attachment but not both
    var messageText = message.text;
    var messageAttachments = message.attachments;

    if (messageText) {
        geocoder.geocode(messageText, function (err, res) {
            if(err) {
                helpers.sendTextMessage(senderID, 'Error while getting information about address occured. Try it again.');
                return;
            }

            if (typeof res[0] == 'undefined') {
                helpers.sendTextMessage(senderID, "Sorry, no address found. Please type in the address in a different way. Or share you location with us (there is a button for it somewhere around).");

                // helpers.callSendAPI({
                //     recipient: {
                //         id: senderID
                //     },
                //     message: {
                //         attachment: {
                //             type: 'image',
                //             payload: {
                //                 url: 'https://msg-test.herokuapp.com/location.jpeg'
                //             }
                //         }
                //     }
                // })

            } else {
                var latitude = res[0].latitude;
                var longitude = res[0].longitude;
                var niceAddress = res[0].formattedAddress;

                if (latitude != '' && longitude != '') {

                    var messageData = {
                        recipient: {
                            id: senderID
                        },
                        message: {
                            attachment: {
                                type: "template",
                                payload: {
                                    template_type: 'button',
                                    text: '"' + niceAddress + '" Is this address correct?',
                                    buttons: [
                                        {
                                            type: 'postback',
                                            title: 'Yes',
                                            payload: JSON.stringify({
                                                action: 'location_confirm',
                                                address: niceAddress,
                                                latitude: latitude,
                                                longitude: longitude
                                            })
                                        },
                                        {
                                            type: 'postback',
                                            title: 'No',
                                            payload: JSON.stringify({action: 'location_reject'})
                                        }
                                    ]
                                }
                            }
                        }
                    }

                    helpers.callSendAPI(messageData);

                } else {
                    helpers.sendTextMessage(senderID, "Pošli nám, kde jsi!");
                }
            }
        });
    } else if (messageAttachments && messageAttachments[0] && messageAttachments[0].type == 'location') {
        let attachment = messageAttachments[0]

        var latitude = attachment.payload.coordinates['lat'];
        var longitude = attachment.payload.coordinates['long'];

        if (latitude != '' && longitude != '') {
            helpers.sendRestaurants(senderID, latitude, longitude)
        } else {
            helpers.sendTextMessage(senderID, "Something really unexpected just happened. No coordinates came.")
        }
    }
}


const postbacks = require('./postbacks')
// Handeling postback calls
// https://developers.facebook.com/docs/messenger-platform/webhook-reference#postback
module.exports.postback = function (event) {
    const json = JSON.parse(event.postback.payload)

    let callback = postbacks.getCallback(json.action)
    if(callback) {
        callback(event, json)
    } else {
        console.log('Invalid postback action');
        helpers.sendTextMessage(event.sender.id, "Something really unexpected just happened.")
    }
}

// Handeling delivery confirmation
// https://developers.facebook.com/docs/messenger-platform/webhook-reference#message_delivery
module.exports.delivery = function (event) {
}
