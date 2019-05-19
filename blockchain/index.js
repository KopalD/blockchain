const Block = require('./block');

class BlockChain {

    constructor() {
        this.chain = [ Block.genesis() ]
    }

    addBlock(data) {
        const lastBlock = this.chain[ this.chain.length - 1 ];
        const block = Block.mine(lastBlock, data);
        this.chain.push(block);

        return block;
    }

    updateChain(newChain) {
        // Check Length
        if(newChain.length <= this.chain.length) {
            console.error('Received chain is not longer than the current chain!')
            return;
        }
        // Check Data Tampering
        if(!this.isValidChain(newChain)) {
            console.error('Received chain is not valid, data is tampered!')
            return;
        }
        this.chain = newChain;
    }

    isValidChain(chain) {
        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            return false;
        }

        for (let i=1; i < chain.length ; i++) {
            const block = chain[i];
            const lastBlock = chain[i-1];

            if(block.lastHash !== lastBlock.hash || block.hash !== Block.blockHash(block)) {
                return false;
            }
        }

        return true;
    }
}

module.exports = BlockChain;