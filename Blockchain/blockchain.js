const Block = require('./block');

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
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