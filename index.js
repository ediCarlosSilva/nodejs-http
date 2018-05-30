// declara o express
var express = require('express');

// carrega o express e atribui à variavel app
// variável app é a referencia para o objeto do express
var app = express();

app.listen(3000, function() {
    console.log("Servidor rodando na porta 3000!");
});

// definindo uma rota de teste... localhost:3000/teste
app.get('/pagamentos', function(req, res) {
    console.log('Recebida requisiçao de teste na porta 3000.');
    res.send('Ok.');
});