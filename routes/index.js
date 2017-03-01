/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
var express = require('express');
var router = express.Router();
var path = require('path');
var mime = require('mime');
var fs = require('fs');
var sendmailTransport = require('nodemailer-sendmail-transport');
var nodemailer = require('nodemailer');
var mailer = nodemailer.createTransport(sendmailTransport({}));
var mailOptions = {
	from: 'noreply@softdoggy.mod.bz',
	to: 'shadowace248@gmail.com',
	subject: 'SoftDoggy Contact Form Message'
};

function sendMail(text) {
	mailOptions.text = text;
	mailer.sendMail(mailOptions, function (error, info) {
		if (error) {
			return console.log(error);
		}
		console.log('Message sent: ' + info.response);
	});
}
function openPDF(filename, res){
	var stream = fs.createReadStream(__dirname + '/../downloads/' + filename);
	var filename = filename; 
	
	filename = encodeURIComponent(filename);
	
	res.setHeader('Content-disposition', 'inline; filename="' + filename + '"');
  	res.setHeader('Content-type', 'application/pdf');
	
	stream.pipe(res);
}

router.get('/download/resume', function (req, res) {
	//var file = __dirname + '/../downloads/Resume.pdf';
	//res.download(file)
	openPDF('Resume.pdf', res)
});
router.get('/download/ceriport', function (req, res) {
	//var file = __dirname + '/../downloads/Resume.pdf';
	//res.download(file)
	openPDF('Ceriport.pdf', res)
});
router.get('/download/transcript', function (req, res) {
	//var file = __dirname + '/../downloads/Transcript.pdf';
	//res.download(file)
	openPDF('Transcript.pdf', res)
});
router.get('/download/OSHA', function (req, res) {
	//var file = __dirname + '/../downloads/OSHA.pdf';
	//res.download(file)
	openPDF('OSHA.pdf', res)
});
router.get('/', function (req, res) {
	//render the main menu
	console.log(req.body);
	res.render('index');
});
router.get('/about', function (req, res) {
	res.render('about');
});
router.get('/projects', function (req, res) {
	res.render('projects');
});
router.get('/standards', function (req, res) {
	res.render('standards');
});
router.get('/contact', function (req, res) {
	res.render('contact');
});
router.get('/donations', function (req, res) {
	res.render('donations');
});
router.get('/license', function (req, res) {
	res.render('license');
});
router.post('/reciveData', function (req, res) {
	//https://www.npmjs.com/package/express-mailer
	if (!req.body.email || !req.body.message) {
		res.send('Please go back and fill in both the email and message portion of the form.')
	} else if (!req.body.address) {
		res.render('dataRecieved', {
			email: req.body.email,
			message: req.body.message
		});
		var message = req.body.message + '\n\n\t~' + req.body.email;
		sendMail(message);
	} else {
		res.send('YOU ARE A MONSTER, or you just didn\'t know what you were doing.')
	}
});

router.get('/cartMaster', function (req, res) {
	//render the game
	res.render('cartMaster', {
		isHosting: true,
		isPublicGame: false
	});
});

router.get('/questMaster', function (req, res) {
	//render the main menu
	res.render('questMaster', {
		title: 'Quest Master'
	});
});

/*
app.get('/download', function(req, res){

  var file = fs.readFileSync(__dirname + '/upload-folder/dramaticpenguin.MOV', 'binary');

  res.setHeader('Content-Length', file.length);
  res.write(file, 'binary');
  res.end();
});
*/

router.get('/game2', function (req, res) {
	//render the game
	res.render('babylon');
});
module.exports = router;