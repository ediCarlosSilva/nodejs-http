module.exports = function(app) {
    // definindo uma rota de teste... localhost:3000/pagamentos
    app.get('/pagamentos', function(req, res) {
        console.log('Recebida requisiçao de teste na porta 3000.');
        res.send('Ok.');
    });

    app.post('/pagamentos/pagamento', function(req, res) {
        var pagamento = req.body;
        console.log(pagamento);
        res.send('ok');
    });
}