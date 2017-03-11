'use strict'
module.exports = function (_webAddress) {
	const nodemailer = require('nodemailer');
	const webAddress = _webAddress;
	let transporter = nodemailer.createTransport({
		sendmail: true,
		newline: 'unix',
		path: '/usr/sbin/sendmail'
	});
	return {
		send(from, to, msg, subject) {
			transporter.sendMail({
				from: from + '@' + webAddress,
				to: to,
				subject: subject,
				text: msg
			}, (err, info) => {
				console.log(err);
				console.log(info);
				//console.log(info.envelope);
				//console.log(info.messageId);
			});
		},
		sendEmailForm(from, msg) {
			this.send('noreply', 'shadowac248@gmail.com', msg + '\n\n\t~' + from, 'Email Form');
		}
	};
};