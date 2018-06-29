var fs = require('fs');

fs.readFile('colors.jpg', function(err, buffer) {
    console.log('lendo um arquivo.');

    fs.writeFile('colors2.jpg', buffer, function(erro) {
        console.log('escrevendo um arquivo.');
    })
});