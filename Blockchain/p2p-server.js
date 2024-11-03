//  biblioteca 'ws' para permitir a comunicação através de WebSockets.
const Websocket = require('ws');

//  define a porta P2P para se conectar a outros pares da cadeia usando a variável de ambiente P2P_PORT ou usando a porta padrão 5001
const P2P_PORT = process.env.P2P_PORT || 5001;

// define uma lista de pares para se conectar usando a variável de ambiente PEERS, dividindo-a por vírgulas, ou usando uma lista vazia
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

const MESSAGE_TYPES = {
    chain: 'CHAIN',
    transaction: 'TRANSACTION',
    clear_transactions: 'CLEAR_TRANSACTIONS'
};

class P2pServer {
    constructor(blockchain) {
        this.blockchain = blockchain;
        this.sockets = [];
    }

    listen() { // inicia a escuta de novas conexões
        // cria um novo servidor WebSocket na porta P2P_PORT
        const server = new Websocket.Server({port: P2P_PORT});

        // quando um novo cliente se conecta ao servidor, a função passada como argumento (this.connectSocket(socket)) será chamada
        server.on('connection', socket => this.connectSocket(socket));

        this.connectToPeers();
        console.log(`Listening for peer-to-peer connections on: ${P2P_PORT}`);
    }

    connectToPeers() {
        // para cada par na lista de pares, cria um novo cliente WebSocket e se conecta ao par
        peers.forEach(peer => {
            // ws://localhost:5001
            const socket = new Websocket(peer);

            // adiciona um evento de erro ao cliente para que, se houver um erro, ele seja exibido no console
            socket.on('error', () => console.log('Connection failed'));

            // adiciona um evento de conexão ao cliente para que, quando ele se conectar, ele seja adicionado à lista de pares
            socket.on('open', () => this.connectSocket(socket));
        });
    }

    connectSocket(socket) {
        this.sockets.push(socket);
        console.log('Socket connected');

        this.messageHandler(socket);
        this.sendChain(socket);
    }

    messageHandler(socket) {
        socket.on('message', message => {
            const data = JSON.parse(message);

            if (data.type === MESSAGE_TYPES.chain) {
                this.blockchain.replaceChain(data.chain);
            }
        });
    }

    sendChain(socket) {
        socket.send(JSON.stringify({type: MESSAGE_TYPES.chain, chain: this.blockchain.chain})); // cada socket novo deve receber a cadeia de blocos atual
    }

    sendTransaction(socket, transaction) {
        socket.send(JSON.stringify({type: MESSAGE_TYPES.transaction, transaction}));
    }

    syncChains() {
        this.sockets.forEach(socket => this.sendChain(socket));
    }

    broadcastTransaction(transaction) {
        this.sockets.forEach(socket => this.sendTransaction(socket, transaction));
    }
}

module.exports = P2pServer;