const express = require('express');
const Blockchain = require('../classes/blockchain');
const HTTP_PORT = process.env.HTTP_PORT || 3001; // porta para rodar a aplicação
const P2pServer = require('./p2p-server');
const TransactionPool = require('../wallet/transaction-pool');

const app = express();
const bc = new Blockchain();
const tp= new TransactionPool();
const p2pServer = new P2pServer(bc, tp);

app.use(express.json());

app.get('/laudos', (req, res) => {
    res.json(bc.chain);
});

app.post('/:cnsPaciente/novo-paciente', (req, res) => {
    const cnsPaciente = Object.values(req.params)[0];

    if (bc.lookForCns(cnsPaciente) == null) {
        const block = bc.addBlock(req.body, cnsPaciente);
        if (block !== null) {
            p2pServer.syncChains();
            res.status(200).redirect('/laudos');
            console.log(`Novo paciente adicionado: ${block.toString()}`);
        } else {
            res.status(400).json({ error: 'Não foi possível adicionar paciente' });
            console.log(`Não foi possível adicionar paciente`);
        }
    } else {
        res.status(400).json({ error: 'Paciente já cadastrado' });
        console.log(`Paciente já cadastrado`);
    }
})

app.put('/:cnsPaciente/novo-laudo', (req, res) => {
    const cnsPaciente = Object.values(req.params)[0];
    const block = bc.updateBlock(cnsPaciente, req.body);
    if (block !== null) {
        console.log(`Novo laudo adicionado ao cns ${cnsPaciente}: ${block.toString()}`);
        res.status(200).json({ success: `Novo laudo adicionado ao cns ${cnsPaciente}`});
        p2pServer.syncChains();
    } else {
        res.status(404).json({ error: 'Paciente não encontrado' });
    }
});

app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`));
p2pServer.listen();