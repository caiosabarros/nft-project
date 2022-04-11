const { assert, expect } = require("hardhat");

const Base1155 = artifacts.require("BaseContract");
//const StoreFunctions = artifacts.require("StoreFunctions");

//const truffleAssert = require('truffle-assertions');
const { expectRevert } = require('@openzeppelin/test-helpers');
 
contract('BaseContract', (accounts) => {

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
    });

    it("check URI was setup correctly", async ()=>{
        const URI = await base1155.uri(0);
        assert.equal(URI, base1155URI);
    });

    it("check BaseContract is ERC1155 compatible", async ()=>{
        const ERC165_COMPARTIBLE = "0xd9b67a26";
        const IERC2981_COMPARTIBLE = "0x2a55205a";
        
        let isERC1155 = await base1155.supportsInterface(ERC165_COMPARTIBLE);
        let isRoyalty = await base1155.supportsInterface(IERC2981_COMPARTIBLE);
        assert.isTrue(isERC1155);
        assert.isTrue(isRoyalty);
    });

    it("check royalty value is correct", async ()=>{
        let royalty = await base1155.royaltyInfo(0, web3.utils.toWei("1","ether"));
        const value = web3.utils.toBN(web3.utils.toWei("1","ether")  *  defaultRoyaltiesPercentage / 100);  
        expect(value).to.eql(royalty.royaltyAmount);
    });

    it("check changing base URI from BaseContract", async ()=>{
        await base1155.setURI("ipfs://NEW_CID/{id}");
        let newURI = await base1155.uri(0);
        assert.notEqual(newURI, base1155URI);
    });

    it("check operators can use mint function", async ()=>{
        let amountToBeMinted = 1
        await base1155.mint(goBlockchain, amountToBeMinted, []);
        let balance = await base1155.balanceOf(goBlockchain, 0);
        assert.equal(amountToBeMinted, balance);

        await base1155.mint(client, amountToBeMinted, []);
        let clientBalance = await base1155.balanceOf(client, 1);
        expect(web3.utils.toBN(amountToBeMinted)).to.eql(clientBalance);
        //assert.equal(amountToBeMinted, clientBalance);
    });

    it("check operators can use the mintBatch function for many NFTs", async ()=>{
        let ids = []
        let amounts = []
        let amountToBeMinted = 289;

        for(let i = 1; i < amountToBeMinted ; i++){
            ids.push(i);
            amounts.push(1);
        }
        await base1155.mintBatch(client, ids, amounts, [], {gasPrice: 300000000});
        //await base1155.mintBatch(goBlockchain, ids, amounts, []);
        let clientBalance = await base1155.balanceOf(client, 250);
        assert.equal(amounts[0], clientBalance);
        //assert.equal(amounts[amountToBeMinted-1],clientBalance);
    });

    it("check hacker cannot mint NFTs", async ()=>{
        let amountToBeMinted = 1
        await expectRevert(
        base1155.mint(hacker, amountToBeMinted, [], {from: hacker}),`AccessControl: account ${hacker} is missing role 0x523a704056dcd17bcf83bed8b68c59416dac1119be77755efe3bde0a64e46e0c`
        );
    });

    it("check hacker cannot set royalties for him", async ()=>{
        expectRevert(
            base1155.setRoyalties(hacker), 'AccessControl: account 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 is missing role 0x0000000000000000000000000000000000000000000000000000000000000000'     
        );
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
});