var fs = require('fs');

module.exports = function(app) {
    app.post('/upload/imagem', function(req, res) {

        var arquivo = req.headers.filename;
        console.log('arquivo recebido: ' + arquivo);

        req
            .pipe(fs.createWriteStream("files/" + arquivo))
            .on('finish', function() {
                console.log("Arquivo escrito");
                res.status(201).send('ok');
            });
    });
};