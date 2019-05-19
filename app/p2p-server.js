const Websocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

class P2PServer {
    constructor(blockchain) {
       this.blockchain = blockchain;
       this.sockets = []; 
    }

    listen() {
        const server = new Websocket.Server({ port : P2P_PORT });

        // Listen for new connections to this server and subscribes 
        // them for new messages ( chain update )
        server.on('connection', socket => this.connectSocket(socket));
        console.info(`Listening for peer-to-peer connections ${P2P_PORT}`);

        // Boot up and connect to other peers !
        this.connectToPeers();
    }

    // Keep records of the peers connected to this server ...
    connectSocket(socket) {
        this.sockets.push(socket);
        console.info("Socket Connected!");

        // Listens for new messages
        this.messageHandler(socket);
        
        // Sends our copy of block-chain
        this.sendChain(socket);
    }

    // connect to other peers and add them / treat them as your peers
    connectToPeers() {
        peers.forEach(peer => {
            const socket = new Websocket(peer);
            socket.on('open', () => this.connectSocket(socket));
        })
    }

    /*
    UPDATES OWN CHAIN WITH INCOMING CHAIN FROM ANY OTHER NODE 
    */
    messageHandler(socket) {
        socket.on('message', message => {
            const data = JSON.parse(message);
            this.blockchain.updateChain(data);
        })
    }

    /* 
    THIS BLOCK IS FOR SENDING THE CHAINS TO OTHER CONNECTED PEERS 
    AFTER A BLOCK IS MINED BY THIS NODE ; NOTIFYING THEM TO UPDATE THEIR CHAIN
    */
    sendChain(socket) {
        socket.send(JSON.stringify(this.blockchain.chain));
    }

    synchronizeChains() {
        this.sockets.forEach( socket => {
            this.sendChain(socket);
        });
    }
}

module.exports = P2PServer;