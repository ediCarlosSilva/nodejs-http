curl http://localhost:3000/pagamentos/pagamento -X POST -v -H "Content-type: application/json" -d '{
    "forma_de_pagamento": "payfast",
    "valor": 10.98,
    "moeda": "BRL",
    "descricao": "criando um pagamento"
}'

# curl com entrada através de um arquivo
# pagamento.json precisa estár localizado na mesma pasta que o comando está sendo executado.
curl http://localhost:3000/pagamentos/pagamento -X POST
 -v -H "Content-type: application/json" -d @files/pagamento.json; echo

 # curl com entrada através de um arquivo e um pipe utilizando json_pp para formatar a saida
# pagamento.json precisa estár localizado na mesma pasta que o comando está sendo executado.
curl http://localhost:3000/pagamentos/pagamento -X POST
 -v -H "Content-type: application/json" -d @files/pagamento.json | json_pp

# comando curl no windows com cmder
# não precisa do -X POST, mas se colocar só da warn
curl http://localhost:3000/pagamentos/pagamento -v -H "Content-type: application/json" -d -@files/pagamento.json

# comando curl para confirmar pagamento usando o metodo PUT do http
curl -X PUT http://localhost:3000/pagamentos/pagamento/id_do_pagamento