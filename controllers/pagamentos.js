module.exports = function(app) {

    const PAGAMENTO_CRIADO = 'CRIADO';
    const PAGAMENTO_CONFIRMADO = 'CONFIRMADO';
    const PAGAMENTO_CANCELADO = 'CANCELADO';

    app.get('/pagamentos', function(req, res) {
        console.log('Recebida requisição na porta 3000.');
        res.send('Ok.');
    });

    app.get('/pagamentos/pagamento/:id', function(req, res) {
        var id = req.params.id;
        console.log('consultando pagamento: ' + id);

        var memcachedclient = app.servicos.memcachedClient();

        memcachedclient.get('pagamento-' + id, function(erro, data) {

            if (erro || !data) {
                // console.log(erro);
                // console.log(data);
                console.log('MISS - chave não encontrada no cache.');

                var connection = app.persistencia.connectionFactory();
                var pagamentoDao = new app.persistencia.PagamentoDao(connection);

                pagamentoDao.buscaPorId(id, function(erro, result) {
                    if (erro) {
                        console.log('erro ao consultar o banco: ' + erro);
                        res.status(500).send(erro);
                        return;
                    }
                    // console.log(result);
                    console.log("Pagamento encontrado: " + JSON.stringify(result));
                    res.send(result);
                    return;
                });


            } else {
                // HIT no cache
                console.log('HIT - valor: ' + JSON.stringify(data));
                res.json(data);
                return;
            }
        });


    })

    app.post('/pagamentos/pagamento', function(req, res) {

        req.assert('pagamento.forma_de_pagamento', 'Forma de pagamento é obrigatória').notEmpty();
        req.assert('pagamento.valor', 'valor é obrigatório e deve ser um decimal.').notEmpty().isFloat();
        req.assert('pagamento.moeda', 'Moeda é obrigatória e deve ter 3 caracteres.').notEmpty().len(3, 3);

        var errors = req.validationErrors();

        if (errors) {
            console.log('Erros de validação encontrados');
            res.status(400).send(errors);
            return;
        }

        var pagamento = req.body["pagamento"];
        console.log('processando pagamento...');

        var connection = app.persistencia.connectionFactory();
        var pagamentoDao = new app.persistencia.PagamentoDao(connection);

        pagamento.status = 'Criado';
        pagamento.data = new Date;

        pagamentoDao.salva(pagamento, function(exception, result) {

            if (exception) {
                console.log('Erro ao inserir no banco: ' + exception);
                res.status(500).send(exception);
            } else {
                pagamento.id = result.insertId;
                // resposta no console da aplicação
                console.log('pagamento criado');

                var memcachedclient = app.servicos.memcachedClient();
                memcachedclient.set('pagamento-' + pagamento.id, pagamento, 100000, function(err) {
                    console.log('nova chave: pagamento-' + pagamento.id);
                });


                if (pagamento.forma_de_pagamento == "cartao") {
                    var cartao = req.body["cartao"];
                    console.log('Forma de pagamento é cartão.');
                    console.log(cartao);

                    var clienteCartoes = new app.servicos.clienteCartoes();

                    clienteCartoes.autoriza(cartao, function(error, request, response, retorno) {

                        if (error) {
                            console.log("erro encontrado.");
                            console.log(error);

                            // res.status(400).send(error);
                            res.status(400).send(error['message']);
                            return;
                        }

                        console.log(retorno);

                        res.location('/pagamentos/pagamento/' + pagamento.id);

                        // nome = operação = relation = rel ( parametro do objeto links)
                        var response = {
                            dados_do_pagamento: pagamento,
                            cartao: retorno,
                            links: [{
                                    href: "http://localhost:3000/pagamentos/pagamento/" + pagamento.id,
                                    method: "PUT",
                                    rel: "confirmar"
                                },
                                {
                                    href: "http://localhost:3000/pagamentos/pagamento/" + pagamento.id,
                                    method: "DELETE",
                                    rel: "cancelar"
                                }
                            ]
                        }

                        res.status(201).json(response);
                        return;
                    });

                } else {

                    res.location('/pagamentos/pagamento/' + pagamento.id);

                    // nome = operação = relation = rel ( parametro do objeto links)
                    var response = {
                        dados_do_pagamento: pagamento,
                        links: [{
                                href: "http://localhost:3000/pagamentos/pagamento/" + pagamento.id,
                                method: "PUT",
                                rel: "confirmar"
                            },
                            {
                                href: "http://localhost:3000/pagamentos/pagamento/" + pagamento.id,
                                method: "DELETE",
                                rel: "cancelar"
                            }
                        ]
                    }

                    // resposta no response do protocolo http
                    // res.send('ok');
                    res.status(201).json(response);
                }

            }

        });
    });

    app.put('/pagamentos/pagamento/:id', function(req, res) {

        var pagamento = {};
        var id = req.params.id;

        pagamento.id = id;
        pagamento.status = 'Confirmado';

        var connection = app.persistencia.connectionFactory();
        var pagamentoDao = new app.persistencia.PagamentoDao(connection);

        pagamentoDao.atualiza(pagamento, function(erro) {
            if (erro) {
                res.status(500).send(erro);
                return;
            }
            console.log('pagamento confirmado');
            var memcachedclient = app.servicos.memcachedClient();
            memcachedclient.set('pagamento-' + pagamento.id, pagamento, 100000, function(err) {
                console.log('nova chave: pagamento-' + pagamento.id);
            });
            res.send(pagamento);
        });

    });

    app.delete('/pagamentos/pagamento/:id', function(req, res) {

        var pagamento = {};
        var id = req.params.id;

        pagamento.id = id;
        pagamento.status = 'cancelado';

        var connection = app.persistencia.connectionFactory();
        var pagamentoDao = new app.persistencia.PagamentoDao(connection);

        pagamentoDao.atualiza(pagamento, function(erro) {
            if (erro) {
                res.status(500).send(erro);
                return;
            }
            console.log('pagamento cancelado');
            var memcachedclient = app.servicos.memcachedClient();
            memcachedclient.set('pagamento-' + pagamento.id, pagamento, 100000, function(err) {
                console.log('nova chave: pagamento-' + pagamento.id);
            });
            res.send(pagamento).status(204);
        });

    });
};