module.exports = function(app) {
    // definindo uma rota de teste... localhost:3000/pagamentos
    app.get('/pagamentos', function(req, res) {
        console.log('Recebida requisiçao de teste na porta 3000.');
        res.send('Ok.');
    });

    app.post('/pagamentos/pagamento', function(req, res) {
        var pagamento = req.body;

        req.assert('forma_de_pagamento', 'Forma de pagamento é obrigatória').notEmpty();
        req.assert('valor', 'valor é obrigatório e deve ser um decimal.').notEmpty().isFloat();
        req.assert('moeda', 'Moeda é obrigatória e deve ter 3 caracteres.').notEmpty().len(3, 3);

        var errors = req.validationErrors();

        if (errors) {
            console.log('Erros de validação encontrados');
            res.status(400).send(errors);
            return;
        }

        console.log('processando pagamento...');

        var connection = app.persistencia.connectionFactory();
        var pagamentoDao = new app.persistencia.PagamentoDao(connection);

        pagamento.status = 'Criado';
        pagamento.data = new Date;

        pagamentoDao.salva(pagamento, function(exception, result) {
            console.log('pagamento criado: ' + result);

            res.location('/pagamentos/pagamento/' + result.insertId);

            pagamento.id = result.insertId;

            res.status(201).json(pagamento);
        });
    });
}