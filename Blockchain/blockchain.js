const Block = require('./block');
const Laudo = require('./laudo');
const Database = require('./database');

const dbConfig = Database.credentials();
const db = new Database(dbConfig);


class Blockchain {
    constructor() {
        this.chain = [];

        // verifica se o bloco gênesis já foi inserido no banco
        const genesisBlock = Block.genesis();
        db.query('SELECT cns_paciente FROM block WHERE hash = ?', genesisBlock.hash)
        .then(result => {
            if (result.length === 0) {
                return db.query('INSERT INTO block SET ?', {
                    hash: genesisBlock.hash,
                    last_hash: genesisBlock.lastHash,
                    cns_paciente: genesisBlock.cnsPaciente,
                    timestamp: genesisBlock.timestamp
                });
            } else {
                console.log('Bloco gênesis já inserido no banco');
            }
        })
        .then(() => db.query('SELECT * FROM block'))
        .then(blocksResult => {
            const blockPromises = blocksResult.map(blockData => {
                let block = new Block(blockData.timestamp, blockData.last_hash, blockData.hash, blockData.cns_paciente);

                return db.query('SELECT * FROM laudos WHERE block_hash = ?', block.hash)
                    .then(laudosResult => {
                        const laudoPromises = laudosResult.map(laudoData => {
                            let laudo = new Laudo(laudoData.data_hora_inicio_consulta, laudoData.data_hora_fim_consulta, laudoData.nome_medico, laudoData.diagnostico, laudoData.sintomas_relatados, laudoData.tratamento_sugerido);

                            return db.query('SELECT * FROM remedios WHERE id_laudo = ?', laudoData.id_laudo)
                                .then(remediosResult => {
                                    laudo.remedios.push(...remediosResult);
                                    block.addLaudo(laudo);
                                });
                        });

                        return Promise.all(laudoPromises).then(() => {
                            this.chain.push(block);
                            console.log('Bloco inserido no array chain: \n', block);
                        });
                    });
            });

            return Promise.all(blockPromises);
        })
        .catch(err => {
            throw err;
        });
    }

    addBlock(laudo, cnsPaciente) {
        if (!Array.isArray(laudo)) {
            laudo = [laudo];
        }
        const block = Block.mineBlock(this.chain[this.chain.length - 1], cnsPaciente, laudo);
        this.chain.push(block);

        return block;
    }

    lookForCns(cnsPaciente) {
        for (let block of this.chain) {
            if (block.cnsPaciente === cnsPaciente) {
                return block;
            }
        }

        return null;
    }

    updateBlock(cnsPaciente, laudo) {
        let block = this.lookForCns(cnsPaciente);

        if (block !== null) {
            if (!Array.isArray(laudo)) {
                block.laudo.push(laudo); // se laudo não for um array, adiciona o laudo ao array
                // this.chain = this.chain.map(element => element.cnsPaciente === cnsPaciente ? block : element);
            } else {
                block.laudo.push(...laudo); // se laudo for um array, adiciona cada elemento do array ao array de laudos
                // this.chain = this.chain.map(element => element.cnsPaciente === cnsPaciente ? block : element);
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