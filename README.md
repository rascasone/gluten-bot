# Gluten Bot

Gluten Bot is a chatbot written for [Facebook Messenger](https://developers.facebook.com/docs/messenger-platform/quickstart). It finds nearest gluten-free restaurants. Simple and easy to use.


## Usage

Go to [Gluten Tag page](https://msg-test.herokuapp.com/) and add the bot to your messenger.

To find restaurant:

* Type in any address or
* Send "Location" (only available in mobile Messenger)

## Development

This project originated from an example server for Messenger Platform built in Node.js. With this app, you can send it messages and it will echo them back to you. You can also see examples of the different types of Structured Messages.

It contains the following functionality:

* Webhook (specifically for Messenger Platform events)
* Send API 
* Web Plugins

Follow the [walk-through](https://developers.facebook.com/docs/messenger-platform/quickstart) to learn about this project in more detail.

## Setup

Set the environmental variables before running the server.

Either in `.env` or in "Variables" section on Heroku.

Replace values for `APP_ID` and `PAGE_ID` in `public/index.html`.

```ruby
# .env
MESSENGER_APP_SECRET=<your_app_secret>
MESSENGER_PAGE_ACCESS_TOKEN=<your_app_page_access_token>
MESSENGER_VALIDATION_TOKEN=<your_webhook_validation_token>
ZOMATO_API_KEY=<your_zomato_api_key>
DB_PG=<your_postgresql_link> # E.g. provided by Heroku plugin
```

## Run

You can start the server by running `npm start`. However, the webhook must be at a public URL that the Facebook servers can reach. Therefore, running the server locally on your machine will not work.

You can run this example on a cloud service provider like Heroku, Google Cloud Platform or AWS. Note that webhooks must have a valid SSL certificate, signed by a certificate authority. Read more about setting up SSL for a [Webhook](https://developers.facebook.com/docs/graph-api/webhooks#setup).

### Running local server

Run `npm start`.

#### Debugging in WebStorm

There is a bug in WebStorm (version 2016.1.3) when using Node.js v6. Place `--expose_debug_as=v8debug` in "Node parameters" to make debug work.

#### Tunelling

Use service like [https://localtunnel.me/]()

Add new Webhook into your Facebook App configuration and assign newly created public IP to it.

## Webhook

All webhook code is in `app.js`. It is routed to `/webhook`. This project handles callbacks for authentication, messages, delivery confirmation and postbacks. More details are available at the [reference docs](https://developers.facebook.com/docs/messenger-platform/webhook-reference).

## Future Plans

* Restaurant Rating
* Help command
* Adding new places

## License

See the LICENSE file in the root directory of this source tree. Feel free to use and modify the code.