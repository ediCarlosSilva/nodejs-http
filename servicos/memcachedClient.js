var memcached = require('memcached');

var client = new memcached('localhost:11211', {
    retries: 10,
    retry: 10000,
    remove: true
});

client.set('pagamento-3', { id: 3, nome: "edi" }, 100000, function(err) {
    console.log('nova chave: pagamnento-3');
});

client.get('pagamento-3', function(erro, data) {

    if (erro || !data) {
        console.log('MISS - chave não encontrada no cache.');
    } else {
        console.log('HIT - valor: ' + JSON.stringify(data));
    }
});