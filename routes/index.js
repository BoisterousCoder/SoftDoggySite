/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    //render the main menu
    res.render('index');
});
router.get('/about', function(req, res) {
    res.render('about');
});
router.get('/about', function(req, res) {
    res.render('about');
});
router.get('/projects', function(req, res) {
    res.render('projects');
});
router.get('/contact', function(req, res) {
    res.render('contact');
});
router.get('/donations', function(req, res) {
    res.render('donations');
});
router.get('/license', function(req, res) {
    res.render('license');
});

router.get('/cartMaster', function(req, res) {
    //render the game
    res.render('cartMaster', {
        isHosting: true,
        isPublicGame: false
    });
});

router.get('/questMaster', function(req, res) {
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

router.get('/game2', function(req, res) {
    //render the game
    res.render('babylon');
});
module.exports = router;