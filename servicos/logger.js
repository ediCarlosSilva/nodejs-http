var winston = require('winston');
var fs = require('fs');

if (!fs.existsSync('logs')) {
    fs.mkdirSync('logs');
}

module.exports = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: "info",
            filename: "logs/payfast.log",
            maxsize: 1048576,
            maxFiles: 10,
            colorize: false
        })
    ]
});

// logger.log('info', 'Log forçando o nível info via parâmetro na função log().');
// logger.info('Log forçando o nível info via invocação direta função info()');