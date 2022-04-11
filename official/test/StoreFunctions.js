const { assert, expect, web3 } = require("hardhat");

const Base1155 = artifacts.require("BaseContract");
const StoreFunctions = artifacts.require("StoreFunctions");
const { expectRevert } = require('@openzeppelin/test-helpers');
const truffleAssertions = require("truffle-assertions");

contract('StoreFunctions', (accounts) => {

    let base1155;
    let base1155URI = "ipfs://CID/{id}";
    let base1155Name = "Store X";
    const [goBlockchain, client, user, hacker] = accounts;
    let defaultRoyaltiesPercentage = 5;

  
    beforeEach('should setup the contract instance', async () => {
        base1155 = await Base1155.new(
            base1155URI, 
            base1155Name, 
            client, 
            defaultRoyaltiesPercentage, 
            client
        );
        storeFunctions = await StoreFunctions.new(
            [goBlockchain, client],
            [10, 90],
            base1155.address
        );
    });

    it("check storeFunctions contract is calling correct ERC1155", async ()=>{
        let uri = await storeFunctions.uri();
        let uri_ = await base1155.uri(0);
        assert.equal(uri, uri_)
    });

    it("should operator authorize storeFunctions sell NF-tokens", async ()=>{
        await base1155.setApprovalForAll(storeFunctions.address, true ,{from: goBlockchain})
        const isApproved = await base1155.isApprovedForAll(goBlockchain, storeFunctions.address);
        assert.isTrue(isApproved);
    });

    it("should operator make a sell offer", async ()=>{
        let amountToBeMinted = 2
        await base1155.mint(goBlockchain, amountToBeMinted, [], {from: goBlockchain});

        let doneSellOffer = await storeFunctions.makeSellOffer(0, web3.utils.toWei("0.1", "ether"), amountToBeMinted, {from: goBlockchain});
        truffleAssertions.eventEmitted(doneSellOffer, 'NewSellOffer', (ev)=>{
            return ev.seller == goBlockchain;
        }, 'Seller should be the owner of the NFT');
        assert.equal(doneSellOffer.tx.length, 66);
    });

    it("user buy NFT, NFT be transferred to the user, Money Transferred to Operators", async ()=>{
        
        let initialEthofGo = await web3.eth.getBalance(goBlockchain)
        let initialEthofClient =  await web3.eth.getBalance(client)

        await base1155.setApprovalForAll(storeFunctions.address, true ,{from: goBlockchain})
        let amountToBeMinted = 2
        
        await base1155.mint(goBlockchain, amountToBeMinted, [], {from: goBlockchain});

        await storeFunctions.makeSellOffer(0, web3.utils.toWei("0.1", "ether"), amountToBeMinted, {from: goBlockchain});
        
        initialBalanceOfUser = await base1155.balanceOf(user,0)
        initialBalanceOfOperator = await base1155.balanceOf(goBlockchain,0)
        let amountToBeBought = 2
        await storeFunctions.buyToken(0, amountToBeBought, {from: user, value: web3.utils.toWei("0.1", "ether") * amountToBeBought});
        finalBalance = await base1155.balanceOf(user,0)
        finalBalanceOfOperator = await base1155.balanceOf(goBlockchain,0)
        let result = initialBalanceOfUser + amountToBeBought
        expect(web3.utils.toBN(finalBalance).toString()).to.eql(web3.utils.toBN(result).toString())
    
        await storeFunctions.release(client, {from: client})
        await storeFunctions.release(goBlockchain, {from: goBlockchain})
        
        let finalEthofGo = await web3.eth.getBalance(goBlockchain)
        let finalEthofClient = await web3.eth.getBalance(client)
        assert.isTrue(initialEthofGo < finalEthofGo)
        assert.isTrue(finalEthofClient > initialEthofClient)
        assert.isTrue(finalEthofClient.toString().length > finalEthofGo.toString().length)
    
        let contractBalance = await storeFunctions.balance()
        assert.isTrue(contractBalance == 0)
    });

//    it("check hacker cannot mint NFTs", async ()=>{
//
//    });        
//
//    it("check hacker cannot mint NFTs", async ()=>{
//
//    });        
//
//    it("check hacker cannot mint NFTs", async ()=>{
//
//    });        
//
//    it("check hacker cannot mint NFTs", async ()=>{
//
//    });        
//
//    it("check hacker cannot mint NFTs", async ()=>{
//
//    });        
//
//    it("check hacker cannot mint NFTs", async ()=>{
//
//    });        
//
//    it("check hacker cannot mint NFTs", async ()=>{
//
//    });        
//
//    it("check hacker cannot mint NFTs", async ()=>{
//
//    });        
//
//    it("check hacker cannot mint NFTs", async ()=>{
//
//    });        
//
//    it("check hacker cannot mint NFTs", async ()=>{
//
//    });        
//
//    it("check hacker cannot mint NFTs", async ()=>{
//
//    });        
//
//
//
});

