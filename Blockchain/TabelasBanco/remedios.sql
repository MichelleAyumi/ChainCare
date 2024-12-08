create table remedios
(
    id_remedio         int auto_increment
        primary key,
    dosagem            varchar(100) not null,
    forma_farmaceutica varchar(100) not null,
    nome               varchar(100) not null,
    id_laudo           int          not null,
    constraint remedios_ibfk_1
        foreign key (id_laudo) references laudos (id_laudo)
);

create index id_laudo
    on remedios (id_laudo);