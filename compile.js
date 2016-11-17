const pug = require('pug');
const fs = require('fs');

let files = fs.readdirSync('./Jade');

files.forEach(function (fileName) {
    let fileExtention = '.' + fileName.split('.')[1];
    fileName = fileName.split('.')[0];
    let htmlText = pug.compileFile('./Jade/' + fileName + fileExtention)({});
    fs.writeFile('./' + fileName + '.html', htmlText);
});