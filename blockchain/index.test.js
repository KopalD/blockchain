const BlockChain = require('.')
const Block = require('./block')

describe('Blockchain', () => {

    let bc, bc2;

    beforeEach(() => {
        bc = new BlockChain();
        bc2 = new BlockChain();
    });

    it('starts with genesis block', () => {
        expect(bc.chain[0]).toEqual(Block.genesis());
    });

    it('adds a new block', () => {
        const data = 'foo';
        bc.addBlock(data);

        expect(bc.chain[bc.chain.length-1].data).toEqual(data);
    });

    it('validates a valid chain', () => {
        bc2.addBlock('bar');
        expect(bc.isValidChain(bc2.chain)).toEqual(true);
    });

    // CORRUPTED BLOCKS CHECKS

    it('invalidates a chain with corrupted genesis block', () => {
        bc2.chain[0].data = 'Bad Data';
        expect(bc.isValidChain(bc2.chain)).toEqual(false);
    });

    it('invalidates a corrupted chain', () => {
        bc2.addBlock('foo');
        bc2.chain[1].data = "NOT FOO";
        expect(bc.isValidChain(bc2.chain)).toEqual(false);

    });

    // UPDATES CHAIN CHECKS

    it('replaces a chain with a valid chain', () => {
        bc2.addBlock('foo');
        bc.updateChain(bc2.chain);
        expect(bc.chain).toEqual(bc2.chain);
    });

    it('does not replaces a chain with a valid chain with same / smaller length', () => {
        bc.addBlock('foo');
        bc.updateChain(bc2.chain);
        expect(bc.chain).not.toEqual(bc2.chain);
    });
})