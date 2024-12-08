create table laudos
(
    id_laudo                  int auto_increment
        primary key,
    data_hora_inicio_consulta datetime     not null,
    data_hora_fim_consulta    datetime     not null,
    nome_medico               varchar(100) not null,
    diagnostico               text         null,
    sintomas_relatados        text         null,
    tratamento_sugerido       text         null,
    block_hash                varchar(64)  null,
    constraint laudos_ibfk_1
        foreign key (block_hash) references block (hash)
);

create index block_hash
    on laudos (block_hash);