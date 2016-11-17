const pug = require('pug');
const fs = require('fs');

let files = fs.readdirSync('./PUG');

files.forEach(function (fileName) {
    let fileExtention = '.' + fileName.split('.')[1];
    fileName = fileName.split('.')[0];
    let htmlText = pug.compileFile('./PUG/' + fileName + fileExtention)({});
    fs.writeFile('./' + fileName + '.html', htmlText);
});