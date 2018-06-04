mysql -u root

create database payfast;

create table pagamentos (
    id int(11) not null auto_increment,
    forma_de_pagamento varchar(255) not null,
    valor decimal(10, 2) not null,
    moeda varchar(3) not null,
    status varchar(255) not null,
    data date,
    descricao text,
    primary key (id)
);

show tables;