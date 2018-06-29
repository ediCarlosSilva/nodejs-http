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

# comando curl para consumir webservice do correio na rota definida pela aplicaçao
curl -X POST http://localhost:3000/correios/calculo-prazo -H "Content-type: application/json" -d @files/dados-entrega.json

# Requisição curl para enviar imagem do arquivo:
curl -X POST http://localhost:3000/upload/imagem -v -H "Content-type: Application/octec-stream" -H "filename: imagem.jpg" --data-binary @imagem.jpg  

# Requisição GET para consultar um pagamento com um id específico
curl -X GET http://localhost:3000/pagamentos/pagamento/10 -v



