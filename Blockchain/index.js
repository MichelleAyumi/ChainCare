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
    const cns = Object.values(req.params)[0];
    const pacienteBlock = bc.lookForCns(cns);

    if (pacienteBlock !== null) {
        res.json(pacienteBlock.laudos);
    } else {
        res.status(404).json({error: 'Paciente não encontrado'});
    }
});

app.post('/:cns/novo-paciente', (req, res) => {
    const cns = Object.values(req.params)[0];
    const laudo = req.body;

    // verifica se o paciente já foi inserido no banco
    db.query('SELECT * FROM block WHERE cns = ?', cns).then(blocoBanco => {
        if (blocoBanco.length === 0 && bc.lookForCns(cns) == null) {
            // insere na blockchain
            const block = bc.addBlock(laudo, cns);
            if (block !== null) {
                p2pServer.syncChains();
                res.status(200).redirect('/laudos');
                console.log(`Novo paciente adicionado: ${block.toString()}`);
            } else {
                res.status(400).json({ error: 'Não foi possível adicionar paciente' });
                console.log(`Não foi possível adicionar paciente`);
            }

            // insere no banco da blockchain
            db.query('INSERT INTO block SET ?', {
                hash: block.hash,
                last_hash: block.lastHash,
                cns: block.cns,
                timestamp: block.timestamp
            }).then(() => {
                console.log('Bloco inserido no banco');

                if (laudo.hasOwnProperty('remedios')) {
                    if (laudo.remedios.length > 0) {
                        // insere o laudo no banco
                        db.query('INSERT INTO laudos SET ?', {
                            data_hora_inicio_consulta: laudo.data_hora_inicio_consulta,
                            data_hora_fim_consulta: laudo.data_hora_fim_consulta,
                            nome_medico: laudo.nome_medico,
                            diagnostico: laudo.diagnostico,
                            sintomas_relatados: laudo.sintomas_relatados,
                            tratamento_sugerido: laudo.tratamento_sugerido,
                            block_hash: block.hash
                        }).then(laudoInserido => {
                            console.log('Laudo inserido no banco');
                            const laudoId = laudoInserido.insertId;

                            if (laudo.remedios.length > 0) {
                                const remediosPromises = laudo.remedios.map(remedio => {
                                    return db.query('INSERT INTO remedios SET ?', {
                                        dosagem: remedio.dosagem,
                                        forma_farmaceutica: remedio.forma_farmaceutica,
                                        nome: remedio.nome,
                                        id_laudo: laudoId
                                    });
                                });

                                return Promise.all(remediosPromises);
                            }
                        });
                    }
                }
                }).catch(err => {
                    throw err;
                });
        } else {
            res.status(403).json({ error: 'Paciente já cadastrado no banco' });
        }
    }).catch(err => {
        throw err;
    });
})

app.put('/:cns/novo-laudo', (req, res) => {
    const cns = Object.values(req.params)[0];
    const laudo = req.body;

    // verifica se o paciente está cadastrado no banco
    db.query('SELECT hash FROM block WHERE cns = ?', cns).then(hashBlocoBanco => {
        if (hashBlocoBanco.length === 0) {
            res.status(404).json({ error: 'Paciente não encontrado no banco da blockchain' });
        } else {
            // insere na tabela laudos
            db.query('INSERT INTO laudos SET ?', {
                data_hora_inicio_consulta: laudo.data_hora_inicio_consulta,
                data_hora_fim_consulta: laudo.data_hora_fim_consulta,
                nome_medico: laudo.nome_medico,
                diagnostico: laudo.diagnostico,
                sintomas_relatados: laudo.sintomas_relatados,
                tratamento_sugerido: laudo.tratamento_sugerido,
                block_hash: hashBlocoBanco[0].hash
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
                const block = bc.updateBlock(cns, req.body);
                if (block !== null) {
                    console.log(`Novo laudo adicionado ao cns ${cns}`);
                    res.status(200).json({ success: `Novo laudo adicionado ao cns ${cns}`});
                    p2pServer.syncChains();
                } else {
                    res.status(404).json({ error: 'Paciente não encontrado na blockchain' });
                }
            }).catch(err => {
                throw err;
            });
        }
    }).catch(err => {
        throw err;
    });
});

app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`));
p2pServer.listen();
