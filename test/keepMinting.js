const fs = require('fs');
const { MINTER, BOT } = require('../src/data/storage');
const { brain: { contract }, truncate } = require('../src/utils');
const sleep = require('../src/utils/sleep');

/**
 * It will keep minting with the target wallet
 */
const keepMinting = async () => {
    const count = fs.readFileSync('./test/count.txt', 'utf8');
    try {
        for (let i = (parseInt(count) + 1); i < 1000000000000000; i++) {
            await sleep(10000);
            contract.methods.mint().send({ from: MINTER });
            fs.writeFileSync('./test/count.txt', `${i}`);
        }
    }
    catch (e) {
        console.log(e)
        fs.writeFileSync('./test/count.txt', `${parseInt(count) + 1}`);
        keepMinting()
    }
};

// listen to transfer events to know the result
contract.events.Transfer()
    .on('connected', id => console.log("Connected for transfer events", id))
    .on("data", data => console.log('Minted =>', { to: data.returnValues.to === BOT ? 'You' : truncate(data.returnValues.to), tokenId: data.returnValues.tokenId, transactionHash: truncate(data.transactionHash) }));

keepMinting();