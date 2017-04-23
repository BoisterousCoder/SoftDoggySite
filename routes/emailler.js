'use strict'
module.exports = function (to) {
	const APIKEY = process.env.apikey;
	const RECIVER = process.env.reciver;
	const DOMAIN = proccess.env.mailSenderDomain
	const MAILGUN = require('mailgun-js')({apiKey: APIKEY, domain: DOMAIN});
	return {
		send(from, to, msg, subject) {
			//nope
		},
		sendEmailForm(from, msg) {
			const DATA = {
				from: 'Mailgun Sandbox <postmaster@sandboxf97b6449364041c689e32c7a3367fd7f.mailgun.org>',
				to: 'Chris <' + RECIVER + '>',
				subject: 'Form Msg',
				text: msg + '\n\n\t~' + from
			};
			mailgun.messages().send(data, function (error, body) {
				console.log(body);
			});
		}
	};
};