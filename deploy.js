require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");
const { Web3 } = require("web3");
const { abi, evm } = require('./compile');

provider = new HDWalletProvider(
    process.env.SECRET_PHRASE,
    process.env.API_KEY,
);

const web3 = new Web3(provider);

const deploy = async() =>{
    const accounts = await web3.eth.getAccounts();
    console.log("Get the Accounts", accounts[0]);

    const res = await new web3.eth.Contract(abi)
        .deploy({ data: evm.bytecode.object, arguments: []})
        .send({ gas: '1000000', from: accounts[0]});

    console.log("Contract deployed to: ", res.options.address);
}

deploy();