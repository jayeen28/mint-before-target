const Web3 = require('web3');
const abi = require('../data/abi.json');
const Wallet = require('@truffle/hdwallet-provider');
const { CONTRACT_ADDRESS, MNEMONIC, RPC, SOCKETRPC } = require('../data/storage');

const provider = new Wallet({
    mnemonic: MNEMONIC,
    providerOrUrl: RPC
});

const web3 = new Web3(provider);
const web3s = new Web3(SOCKETRPC);
const contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
contract.setProvider(SOCKETRPC);
module.exports = { web3, web3s, contract };
