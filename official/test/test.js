const Base1155 = artifacts.require("BaseContract");
const StoreFunctions = artifacts.require("StoreFunctions");

const truffleAssert = require('truffle-assertions');
const { expectRevert } = require('@openzeppelin/test-helpers');
 
contract('BaseContract', (accounts) => {

    let base1155;
    let base1155URI = "ipfs://CID/{id}";
    let base1155Name = "Store X";
    const [goBlockchain, client] = accounts;
    let defaultRoyaltiesPercentage = 5;
    
    beforeEach('should setup the contract instance', async () => {
        const base1155 = await Base1155.new(
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

    it("", async ()=>{

    });

    it("", async ()=>{

    });

    it("", async ()=>{

    });

    it("", async ()=>{

    });

    it("", async ()=>{

    });
});