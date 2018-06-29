var fs = require('fs');

fs.createReadStream('colors.jpg')
    .pipe(fs.createWriteStream('color-com-stream.jpg'))
    .on('finish', function() {
        console.log('arquivo escrito.');
    })