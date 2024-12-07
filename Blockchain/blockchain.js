const Block = require('./block');
const Laudo = require('./laudo');
const Database = require('./database');

const dbConfig = Database.credentials();
const db = new Database(dbConfig);


class Blockchain {
    constructor() {
        this.chain = [];

        // verifica se o bloco gênesis já foi inserido no banco
        db.query('SELECT cns_paciente FROM block WHERE hash = ?', Block.genesis().hash).then(result => {
            if (result.length === 0) {
                // insere no banco da blockchain
                db.query('INSERT INTO block SET ?', {
                    hash: this.chain[0].hash,
                    last_hash: this.chain[0].lastHash,
                    cns_paciente: this.chain[0].cnsPaciente,
                    timestamp: this.chain[0].timestamp
                }).then(() => {
                    console.log('Bloco gênesis inserido no banco');
                }).catch(err => {
                    throw err;
                });
            } else {
                console.log('Bloco gênesis já inserido no banco');
            }
        }).catch(err => {
            throw err;
        });

        // pega todas as informações dos blocos do banco e insere no array chain
        db.query('SELECT * FROM block').then(result => {
            for (let i = 0; i < result.length; i++) {
                let block = new Block(result[i].timestamp, result[i].last_hash, result[i].hash, result[i].cns_paciente);

                // pega todas as informações dos laudos do banco e insere no array laudo do bloco
                db.query('SELECT * FROM laudos WHERE block_hash = ?', block.hash).then(laudoBanco => {
                    if(laudoBanco.length === 0) {
                        console.log('nenhum laudo encontrado'); // remover essa linha
                    }
                    for (let indiceLaudoBanco = 0; indiceLaudoBanco < laudoBanco.length; indiceLaudoBanco++) {
                        console.log('laudo atual: ', laudoBanco[indiceLaudoBanco]);

                        let laudo = new Laudo(laudoBanco[indiceLaudoBanco].data_hora_inicio_consulta, laudoBanco[indiceLaudoBanco].data_hora_fim_consulta, laudoBanco[indiceLaudoBanco].nome_medico, laudoBanco[indiceLaudoBanco].diagnostico, laudoBanco[indiceLaudoBanco].sintomas_relatados, laudoBanco[indiceLaudoBanco].tratamento_sugerido);

                        block.laudo.push(laudo);
                        console.log('Laudo inserido no bloco: ', block.laudo);

                        // pega todas as informações dos remédios do banco e insere no array remedios do laudo
                        db.query('SELECT * FROM remedios WHERE id_laudo = ?', laudoBanco[indiceLaudoBanco].id_laudo).then(remedioBanco => {
                            if (remedioBanco.length === 0) {
                                console.log('nenhum remédio encontrado')
                                block.addLaudo(laudo);
                            } else {
                                for (let indiceRemedioBanco = 0; indiceRemedioBanco < remedioBanco.length; indiceRemedioBanco++) {
                                    laudo.remedios.push(remedioBanco[indiceRemedioBanco]);
                                }
                                console.log('laudo.remedios: ', laudo.remedios);
                                block.addLaudo(laudo);
                            }
                        }).catch(err => {
                            throw err;
                        });
                    }
                }).catch(err => {
                    throw err;
                });

                this.chain.push(block);
                console.log('Bloco inserido no array chain: ', block);
            }
        }).catch(err => {
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