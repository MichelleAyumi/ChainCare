const express = require('express');
const Blockchain = require('./blockchain');
const HTTP_PORT = process.env.HTTP_PORT || 3001; // porta para rodar a aplicação
const P2pServer = require('./p2p-server');
const Database = require('./database');

const app = express();
const bc = new Blockchain();
const p2pServer = new P2pServer(bc);
const dbConfig = Database.credentials();
const db = new Database(dbConfig);

app.use(express.json());

app.get('/laudos', (req, res) => {
    res.json(bc.chain);
});

app.get('/laudos/:cns', (req, res) => {
    const cnsPaciente = Object.values(req.params)[0];
    const pacienteBlock = bc.lookForCns(cnsPaciente);

    if (pacienteBlock !== null) {
        res.json(pacienteBlock.laudo);
    } else {
        res.status(404).json({error: 'Paciente não encontrado'});
    }
});

app.post('/:cnsPaciente/novo-paciente', (req, res) => {
    const cnsPaciente = Object.values(req.params)[0];

    if (bc.lookForCns(cnsPaciente) == null) {
        const block = bc.addBlock(req.body, cnsPaciente);
        if (block !== null) {
            p2pServer.syncChains();
            res.status(200).redirect('/laudos');
            console.log(`Novo paciente adicionado: ${block.toString()}`);

            // insere no banco da blockchain
            db.query('INSERT INTO block SET ?', {
                hash: block.hash,
                last_hash: block.lastHash,
                cns_paciente: block.cnsPaciente,
                timestamp: block.timestamp
            }).then(() => {
                console.log('Bloco inserido no banco');

            // insere na tabela laudos
                const laudo = req.body;

                db.query('INSERT INTO laudos SET ?', {
                    data_hora_inicio_consulta: laudo.data_hora_inicio_consulta,
                    data_hora_fim_consulta: laudo.data_hora_fim_consulta,
                    nome_medico: laudo.nome_medico,
                    diagnostico: laudo.diagnostico,
                    sintomas_relatados: laudo.sintomas_relatados,
                    tratamento_sugerido: laudo.tratamento_sugerido,
                    block_hash: block.hash
                }).then(result => {
                    console.log('Laudo inserido no banco');
                    const laudoId = result.insertId;

                    const remediosPromises = laudo.remedios.map(remedio => {
                        return db.query('INSERT INTO remedios SET ?', {
                            dosagem: remedio.dosagem,
                            forma_farmaceutica: remedio.forma_farmaceutica,
                            nome: remedio.nome,
                            id_laudo: laudoId
                        });
                    });

                    return Promise.all(remediosPromises);
                });
            }).catch(err => {
                throw err;
            });
        } else {
            res.status(400).json({ error: 'Não foi possível adicionar paciente' });
            console.log(`Não foi possível adicionar paciente`);
        }
    } else {
        res.status(400).json({ error: 'Paciente já cadastrado' });
        console.log(`Paciente já cadastrado`);
    }
})

app.put('/:cnsPaciente/novo-laudo', (req, res) => {
    const cnsPaciente = Object.values(req.params)[0];
    const laudo = req.body;

    // insere na tabela laudos
    db.query('INSERT INTO laudos SET ?', {
        data_hora_inicio_consulta: laudo.data_hora_inicio_consulta,
        data_hora_fim_consulta: laudo.data_hora_fim_consulta,
        nome_medico: laudo.nome_medico,
        diagnostico: laudo.diagnostico,
        sintomas_relatados: laudo.sintomas_relatados,
        tratamento_sugerido: laudo.tratamento_sugerido,
        block_hash: block.hash
    }).then(result => {
        console.log('Laudo inserido no banco');

        const laudoId = result.insertId;

        const remediosPromises = laudo.remedios.map(remedio => {
            return db.query('INSERT INTO remedios SET ?', {
                dosagem: remedio.dosagem,
                forma_farmaceutica: remedio.forma_farmaceutica,
                nome: remedio.nome,
                id_laudo: laudoId
            });
        });

        Promise.all(remediosPromises).then(() => {
            console.log('Remédios inseridos no banco');
        }).catch(err => {
            console.error('Erro ao inserir remédios no banco: ', err);
        });
    }).then(() => {
        const block = bc.updateBlock(cnsPaciente, req.body);
        if (block !== null) {
            console.log(`Novo laudo adicionado ao cns ${cnsPaciente}`);
            res.status(200).json({ success: `Novo laudo adicionado ao cns ${cnsPaciente}`});
            p2pServer.syncChains();
        } else {
            res.status(404).json({ error: 'Paciente não encontrado' });
        }
    }).catch(err => {
        throw err;
    });
});

app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`));
p2pServer.listen();
