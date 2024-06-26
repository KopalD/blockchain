const SHA256 = require('crypto-js/sha256');
const { DIFFICULTY, MINE_RATE } = require('../config');

class Block {

    constructor(timestamp, lastHash, hash, data, nonce, difficulty) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty || DIFFICULTY;
    }

    static genesis() {
        return new this('Genesis Time', '----', 'f1r57-h45h', [], 0, DIFFICULTY);
    }

    static mine(lastBlock, data) {
        let hash, timestamp;
        const lastHash = lastBlock.hash;
        let { difficulty } = lastBlock;
        let nonce = 0;

        do {    
            nonce++;   
            timestamp = Date.now();
            difficulty = Block.regulateDifficulty(lastBlock, timestamp);
            hash = this.hash(timestamp, lastHash, data, nonce, difficulty);
        } while (hash.substring(0,difficulty) !== '0'.repeat(difficulty));

        console.info('Block Mined!')
        return new this(timestamp, lastHash, hash, data, nonce, difficulty);
    }

    static regulateDifficulty(lastBlock, currentTime) {
        let { difficulty } = lastBlock;
        difficulty = lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1;
        return difficulty;
    }

    static blockHash(block) {
        const { timestamp, lastHash, data, nonce, difficulty } = block;
        return Block.hash(timestamp, lastHash, data, nonce, difficulty);
    }

    static hash(timestamp, lastHash, data, nonce, difficulty) {
        return SHA256(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString();
    }

    toString() {
        return `BLOCK - 
            Timestamp   : ${this.timestamp}
            Last Hash   : ${this.lastHash.substring(0,10)}
            Hash        : ${this.hash.substring(0,10)}
            Nonce       : ${this.nonce}
            Difficulty  : ${this.difficulty}
            Data        : ${this.data}
        `;
    }
}

module.exports = Block;