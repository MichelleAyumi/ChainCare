const ChainUtil = require('./chain-util');
const {DIFFICULTY, MINE_RATE} = require('./config');

class Block {
    constructor(timestamp, lastHash, hash, cns, laudos, nonce, difficulty) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.cns = cns;
        this.laudos = laudos || [];
        this.nonce = nonce;
        this.difficulty = difficulty || DIFFICULTY;
    }

    addLaudo(laudos) {
        this.laudos.push(laudos);
    }

    toString() {
        return `Block: "
            timestamp = "${this.timestamp}"
            lastHash = "${this.lastHash}"
            hash = "${this.hash}"
            cns = "${this.cns}"
            laudos = "${this.laudos}"
            difficulty = "${this.difficulty}"
            nonce = "${this.nonce}"`;
    }

    static genesis() {
        return new this(123456789, 0, 123, 0, [], 0, DIFFICULTY);
    }

    static mineBlock (lastBlock, cns, laudos) {
        let hash, timestamp;
        const lastHash = lastBlock.hash;
        let {difficulty} = lastBlock;
        let nonce = 0;

        do {
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty(lastBlock, timestamp);
            hash = Block.hash(timestamp, lastHash, cns, laudos, nonce, difficulty);
        } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));


        return new this(timestamp, lastHash, hash, cns, laudos, nonce, difficulty);
    }

    static hash (timestamp, lastHash, cns, laudos, nonce, difficulty) {
        return ChainUtil.hash(`${timestamp}${lastHash}${cns}${laudos}${nonce}${difficulty}`).toString();
    }

    static blockHash (block) {
        const {timestamp, lastHash, cns, laudos, nonce, difficulty} = block;
        return Block.hash(timestamp, lastHash, cns, laudos, nonce, difficulty);
    }

    static adjustDifficulty(lastBlock, currentTimestamp) {
        /*
        * ajusta a dificuldade baseado no tempo levado para minerar o bloco
        * se o tempo para gerar o bloco atual for menor que o tempo para gerar o bloco anterior somado ao mine rate,
        * deve-se aumentar a dificuldade, caso contrário, diminuir
        * */

        let {difficulty} = lastBlock;
        difficulty = lastBlock.timestamp + MINE_RATE > currentTimestamp ? difficulty + 1 : difficulty - 1;

        return difficulty;
    }
}

module.exports = Block;