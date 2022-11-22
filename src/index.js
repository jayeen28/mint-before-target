require('dotenv').config();
const { TARGET, BOT, INPUT, GASINC } = require("./data/storage");
const { brain: { web3s, contract }, truncate } = require("./utils");

/**
 * Everything starts from here
 */
const main = async () => {
    try {
        web3s.eth.subscribe("pendingTransactions")// subscribe to pending transactions
            .on("connected", id => console.log("Connected for pending transaction ", id))
            .on("data", async (txHash) => {
                web3s.eth.getTransaction(txHash, async function (err, PT) {
                    if (err) return console.log(err);
                    // sometimes the transaction data will be null so we need to request again for the transaction data
                    while (PT === null) { PT = await web3s.eth.getTransaction(txHash) };
                    // if target mints then it will mint also increasing the gas
                    if (PT.from === TARGET && PT.input === INPUT) {
                        console.log('Pending =>', { from: truncate(PT.from), transactionHash: truncate(PT.hash) });
                        contract.methods.mint().send({ from: BOT, gas: Math.ceil(PT.gas + PT.gas * GASINC), gasPrice: PT.gasPrice });
                    }
                })
            })
            .on("changed", data => console.log({ data }))
    }
    catch (e) { console.log(e) }
};
main();