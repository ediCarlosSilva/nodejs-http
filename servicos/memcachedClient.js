var memcached = require('memcached');

module.exports = function() {
    return createMemcachedClient;
}

function createMemcachedClient() {
    var client = new memcached('localhost:11211', {
        retries: 10,
        retry: 10000,
        remove: true
    });
    return client;
}

// client.set('pagamento-3', { id: 3, nome: "edi" }, 100000, function(err) {
//     console.log('nova chave: pagamnento-3');
// });

// client.get('pagamento-4', function(erro, data) {

//     if (erro || !data) {
//         console.log(erro);
//         console.log(data);
//         console.log('MISS - chave não encontrada no cache.');
//     } else {
//         console.log('HIT - valor: ' + JSON.stringify(data));
//     }
// });