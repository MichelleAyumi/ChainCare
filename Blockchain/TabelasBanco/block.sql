create table block
(
    hash      varchar(64) not null
        primary key,
    last_hash varchar(64) not null,
    cns       int         not null,
    timestamp bigint      null
);