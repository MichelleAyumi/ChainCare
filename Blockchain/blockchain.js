const Block = require('./block');
const Database = require('./database');

const dbConfig = Database.credentials();
const db = new Database(dbConfig);


class Blockchain {
    constructor() {
        this.chain = [];

        // verifica se o bloco gênesis já foi inserido no banco
        const genesisBlock = Block.genesis();
        db.query('SELECT cns FROM block WHERE hash = ?', genesisBlock.hash)
        .then(result => {
            if (result.length === 0) {
                return db.query('INSERT INTO block SET ?', {
                    hash: genesisBlock.hash,
                    last_hash: genesisBlock.lastHash,
                    cns: genesisBlock.cns,
                    timestamp: genesisBlock.timestamp
                });
            } else {
                console.log('Bloco gênesis já inserido no banco');
            }
        })
        .then(() => db.query('SELECT * FROM block'))
        .then(blocksResult => {
            const blockPromises = blocksResult.map(blockData => {
                let blockJson = {
                    timestamp: blockData.timestamp,
                    lastHash: blockData.last_hash,
                    hash: blockData.hash,
                    cns: blockData.cns,
                    laudos: []
                };

                return db.query('SELECT * FROM laudos WHERE block_hash = ?', blockJson.hash)
                    .then(laudosResult => {
                        const laudoPromises = laudosResult.map(laudoData => {
                            let laudo = {
                                data_hora_inicio_consulta: laudoData.data_hora_inicio_consulta,
                                data_hora_fim_consulta: laudoData.data_hora_fim_consulta,
                                nome_medico: laudoData.nome_medico,
                                diagnostico: laudoData.diagnostico,
                                sintomas_relatados: laudoData.sintomas_relatados,
                                tratamento_sugerido: laudoData.tratamento_sugerido,
                                remedios: []
                            };

                            return db.query('SELECT * FROM remedios WHERE id_laudo = ?', laudoData.id_laudo)
                                .then(remediosResult => {
                                    laudo.remedios.push(...remediosResult);
                                    blockJson.laudos.push(laudo);
                                });
                        });

                        return Promise.all(laudoPromises).then(() => {
                            this.chain.push(blockJson);
                            console.log('Bloco inserido no array chain: \n', blockJson);
                        });
            });
            });

            return Promise.all(blockPromises);
        })
        .catch(err => {
            throw err;
        });
    }

    addBlock(laudo, cns) {
        if (!Array.isArray(laudo)) {
            laudo = [laudo];
        }
        const block = Block.mineBlock(this.chain[this.chain.length - 1], cns, laudo);
        this.chain.push(block);

        return block;
    }

    lookForCns(cns) {
        for (let block of this.chain) {
            if (parseInt(block.cns) === parseInt(cns)) {
                return block;
            }
        }

        return null;
    }

    updateBlock(cns, laudo) {
        let block = this.lookForCns(cns);

        if (block !== null) {
            if (!Array.isArray(laudo)) {
                block.laudos.push(laudo); // se laudo não for um array, adiciona o laudo ao array
            } else {
                block.laudos.push(...laudo); // se laudo for um array, adiciona cada elemento do array ao array de laudos
            }
        } else {
            console.log('Paciente não encontrado');
        }

        return block;
    }

    isValidChain(chain) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;

        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];
            const lastBlock = chain[i - 1];

            if (block.lastHash !== lastBlock.hash || block.hash !== Block.blockHash(block)) {
                return false;
            }
        }

        return true;
    }

    replaceChain(newChain) {
        if (newChain.length <= this.chain.length) {
            console.log('Received chain is not longer than the current chain.');
            return;
        } else if (!this.isValidChain(newChain)) {
            console.log('The received chain is not valid.');
            return;
        }

        console.log('Replacing blockchain with the new chain.');
        this.chain = newChain;
    }
}

module.exports = Blockchain;