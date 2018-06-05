curl http://localhost:3000/pagamentos/pagamento -X POST -v -H "Content-type: application/json" -d '{
    "forma_de_pagamento": "payfast",
    "valor": 10.98,
    "moeda": "BRL",
    "descricao": "criando um pagamento"
}'; echo

# curl com entrada através de um arquivo
# pagamento.json precisa estár localizado na mesma pasta que o comando está sendo executado.
curl http://localhost:3000/pagamentos/pagamento -X POST -v -H "Content-type: application/json" -d @pagamento.json; echo
