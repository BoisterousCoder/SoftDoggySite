const jade = require('jade');
const fs = require('fs');

let files = fs.readdirSync('./Jade');

files.forEach(function(fileName){
    let fileText = fs.readFileSync('./Jade/'+fileName);
    let htmlText = jade.compile(fileText, {})({});
    fs.writeFile('./' + fileName, htmlText);
});
