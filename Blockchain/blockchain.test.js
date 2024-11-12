const Blockchain = require('../classes/blockchain');
const Block = require('../classes/block');

describe('Blockchain', () => {
    let bc;
    let bc2;

    beforeEach(() => {
        bc = new Blockchain();
        bc2 = new Blockchain();
    });

    it('starts with the genesis block', () => {
        expect(bc.chain[0]).toEqual(Block.genesis());
    });

    it('adds a new block', () => {
        const laudo = 'foo';
        bc.addBlock(laudo, "");

        expect(bc.chain[bc.chain.length-1].laudo).toEqual(laudo);
    });

    it('updates the laudo from a block', () => {
        const cnsPaciente = 108342;
        const laudo = 'foo';
        const newData = 'bar';
        bc.addBlock(laudo, cnsPaciente);
        bc.addOrUpdateBlock(bc.chain[1].cnsPaciente, newData);

        expect(bc.chain[bc.chain.length-1].laudo).toEqual([laudo, newData]);
    });

    it('does not update the laudo from a block', () => {
        const cnsPaciente = 108342;
        const laudo = 'foo';
        const newLaudo = 'bar';
        bc.addBlock(laudo, cnsPaciente);
        bc.updateBlock(108341, newLaudo);

        expect(bc.chain[bc.chain.length-1].laudo).toEqual([laudo]);
    });

    it('validates a valid chain', () => { // não está funcionando...
        bc2.addBlock('foo');
        expect(bc.isValidChain(bc2.chain)).toBe(true);
    });

    it('invalidates a chain with a corrupted genesis block', () => {
        bc2.chain[0].laudo = 'Bad laudo';
        expect(bc.isValidChain(bc2.chain)).toBe(false);
    });

    it('invalidates a corrupt chain', () => {
        bc2.addBlock('foo');
        bc2.chain[1].laudo = 'Not foo';

        expect(bc.isValidChain(bc2.chain)).toBe(false);
    });

    it('replaces the chain with a valid chain', () => {
        bc2.addBlock('goo');
        bc.replaceChain(bc2.chain);

        expect(bc.chain).toEqual(bc2.chain);
    });

    it('does not replace the chain with one of less or equal length', () => {
        bc.addBlock('foo');
        bc.replaceChain(bc2.chain);

        expect(bc.chain).not.toEqual(bc2.chain);
    });
});