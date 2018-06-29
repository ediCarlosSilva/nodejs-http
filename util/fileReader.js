// Lendo arquivos em Buffer mode
var fs = require('fs');
var arquivo = process.argv[2];

fs.readFile(arquivo, function(err, buffer) {
    console.log('arquivo lido.');
    fs.writeFile(arquivo + 'recebido', buffer, function(erro) {
        console.log('arquivo criado.');
    });
});