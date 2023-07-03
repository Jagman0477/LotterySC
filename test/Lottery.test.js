const assert = require("assert");
const ganache = require("ganache");
const { Web3 } = require("web3");
const { abi, evm } = require("../compile");

const web3 = new Web3(ganache.provider());

let fetchedAccounts;
let lottery;

beforeEach(async() => {
    //Fetching a list of all accounts
    fetchedAccounts = await web3.eth.getAccounts();

    lottery = await new web3.eth.Contract(abi)
        .deploy({ data: evm.bytecode.object, arguments: []} )
        .send({ from: fetchedAccounts[0], gas: '1000000'})

});

describe('Lottery Contract', () => {

    it("The contract is deployed", () => {
        assert.ok(lottery.options.address);
    })

    it("Does only one player's address gets added", async () => {
        await  lottery.methods.enterLottery().send({
            from: fetchedAccounts[0],
            value: web3.utils.toWei('0.01', 'ether')    
        })

        const players = await lottery.methods.getPlayer().call({
            from: fetchedAccounts[0]
        })

        assert.equal(fetchedAccounts[0], players[0]);
        assert.equal(1, players.length);
    })

    it("Allows multiple players`s address's to get added", async () => {
        await  lottery.methods.enterLottery().send({
            from: fetchedAccounts[0],
            value: web3.utils.toWei('0.01', 'ether')    
        })

        await  lottery.methods.enterLottery().send({
            from: fetchedAccounts[1],
            value: web3.utils.toWei('0.01', 'ether')    
        })

        await  lottery.methods.enterLottery().send({
            from: fetchedAccounts[2],
            value: web3.utils.toWei('0.01', 'ether')    
        })

        const players = await lottery.methods.getPlayer().call({
            from: fetchedAccounts[0]
        })

        assert.equal(fetchedAccounts[0], players[0]);
        assert.equal(fetchedAccounts[1], players[1]);
        assert.equal(fetchedAccounts[2], players[2]);
        assert.equal(3, players.length);
    })

    it("GIVE MORE ETHER(if u give less ether)", async () => {
        try{
            await  lottery.methods.enterLottery().send({
                from: fetchedAccounts[0],
                value: web3.utils.toWei('100', 'wei')    
            })
            assert(false)
        } catch(e){
            assert(e);   
        }
    })

    it("I WANNA TALK TO YOUR MANAGER", async () => {
        try{
            await lottery.methods.pickWinner().send({
                from: fetchedAccounts[1]
            })
            assert(false)
        } catch(e){
            assert(e)
        }
    })

    it("I WIN U LOSE", async () => {
        try{
            await lottery.methods.enterLottery().send({
                from: fetchedAccounts[0],
                value: web3.utils.toWei('0.01', 'ether')
            })
            const initialBalance = await web3.eth.getBalance(fetchedAccounts[0]);
            await lottery.methods.pickWinner().send({
                from: fetchedAccounts[0],
            })
            const players = await lottery.methods.getPlayer().call();
            const balance = await web3.eth.address(this).balance;
            const finalBalance = await web3.eth.getBalance(fetchedAccounts[0]);

            assert(players.length == 0);
            assert(balance == 0);
            assert((finalBalance - initialBalance) > web3.utils.toWei('1.9', 'ether'));
        } catch(e){
            assert(e)
        }
        
    })
})