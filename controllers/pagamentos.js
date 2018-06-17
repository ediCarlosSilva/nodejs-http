module.exports = function(app) {

    const PAGAMENTO_CRIADO = 'CRIADO';
    const PAGAMENTO_CONFIRMADO = 'CONFIRMADO';
    const PAGAMENTO_CANCELADO = 'CANCELADO';

    // definindo uma rota de teste... localhost:3000/pagamentos
    app.get('/pagamentos', function(req, res) {
        console.log('Recebida requisiçao de teste na porta 3000.');
        res.send('Ok.');
    });

    app.post('/pagamentos/pagamento', function(req, res) {
        var body = req.body;
        var pagamento = body['pagamento'];

        req.assert('pagamento.forma_de_pagamento', 'Forma de pagamento é obrigatória').notEmpty();
        req.assert('pagamento.valor', 'valor é obrigatório e deve ser um decimal.').notEmpty().isFloat();
        req.assert('pagamento.moeda', 'Moeda é obrigatória e deve ter 3 caracteres.').notEmpty().len(3, 3);

        var errors = req.validationErrors();

        if (errors) {
            console.log('Erros de validação encontrados');
            res.status(400).send(errors);
            return;
        }

        console.log('processando pagamento...');

        var connection = app.persistencia.connectionFactory();
        var pagamentoDao = new app.persistencia.PagamentoDao(connection);

        pagamento.status = PAGAMENTO_CRIADO;
        pagamento.data = new Date;

        pagamentoDao.salva(pagamento, function(exception, result) {
            if (exception) {
                console.log('Erro ao inserir no banco: ' + erro);
                res.status(500).send(erro);
            } else {
                console.log('pagamento criado: ' + result);

                res.location('/pagamentos/pagamento/' + result.insertId);

                pagamento.id = result.insertId;

                var response = {
                    dados_do_pagamento: pagamento,
                    links: [{
                            href: "http://localhost:3000/pagamentos/pagamento/" + pagamento.id,
                            rel: "confirmar",
                            method: "PUT"
                        },
                        {
                            href: "http://localhost:3000/pagamentos/pagamento/" + pagamento.id,
                            rel: "cancelar",
                            method: "DELETE"
                        }
                    ]
                }
                res.status(201).json(response);
            }
        });
    });

    app.put('/pagamentos/pagamento/:id', function(req, res) {

        var pagamento = {};
        var id = req.params.id;

        pagamento.id = id;
        pagamento.status = PAGAMENTO_CONFIRMADO;

        var connection = app.persistencia.connectionFactory();
        var pagamentoDao = new app.persistencia.PagamentoDao(connection);

        pagamentoDao.atualiza(pagamento, function(erro) {
            if (erro) {
                res.status(500).send(erro);
                return;
            }
            console.log('pagamento confirmado');
            res.send(pagamento);
        });

    });

    app.delete('/pagamentos/pagamento/:id', function(req, res) {
        var pagamento = {};
        var id = req.params.id;

        pagamento.id = id;
        pagamento.status = PAGAMENTO_CANCELADO;

        var connection = app.persistencia.connectionFactory();
        var pagamentoDao = new app.persistencia.PagamentoDao(connection);

        pagamentoDao.atualiza(pagamento, function(erro) {
            if (erro) {
                res.status(500).send(erro);
                return;
            }
            console.log('pagamento cancelado');
            res.status(204).send(pagamento);
        });
    });

}