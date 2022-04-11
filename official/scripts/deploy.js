const hre = require("hardhat");


async function main() {
  await hre.run('compile');

  const BaseContract = await hre.ethers.getContractFactory("BaseContract");
  const StoreFunctions = await hre.ethers.getContractFactory("StoreFunctions");

  // Link to NFTs metadata
  let _contractURI = "ipfs://QmeASdnVUkgmzBeTmumBLpkwg3U6LB284DSCDpSxpHB4EL/{id}"
  // Name of Collection to be Shown on Opensea/Metamask/etc
  let _name = "Hackers"
  // Carteira do Clinte
  let _client= "0x7ded4ab0E3A23c550318a0b8C6030f4581AaC54c"
  // Porcentagem de Royalties Na Venda Secundaria das NFTs dentro de um Marketplace
  let _royaltiesPercentage = 5
  // Wallet Address Para O Qual o Dinheiro Dos Royalties Will Go
  let _royaltiesRecipient= "0xE827959190A8270097346Be73b0484061c3F5CfD"
  // Wallet Address From GoBlockchain Team
  let goBlockchainAddress = "0x7ded4ab0E3A23c550318a0b8C6030f4581AaC54c"
  // GoBlockchain Fee Percentage In Each Sale Made In Our Store
  let GO_FEE = 100
  // Client Fee Percentage In Each Sale Made In Our Store
  let CLIENT_FEE = 0
  // Note: CLIENT_FEE + GO_FEE Must be Equal to 100%. 
  //If More People Are Added, All The Fees Must Sum Up to 100%

  console.log("Deploying BaseContract...")
  let base = await BaseContract.deploy(_contractURI, _name, _client, _royaltiesPercentage, _royaltiesRecipient);
  await base.deployed();

  console.log("BaseContract deployed to:", base.address);
  console.log("BaseContract hash:", base.deployTransaction.hash);
  console.log("BaseContract owner:", base.deployTransaction.from);
  console.log("BaseContract chainId:", base.deployTransaction.chainId);

  console.log("Deploying StoreFunctions...")
  let factory = await StoreFunctions.deploy([goBlockchainAddress], [GO_FEE], base.address);
  await factory.deployed();
  console.log("\n");
  console.log("StoreFunctions deployed to:", factory.address);
  console.log("StoreFunctions hash:", factory.deployTransaction.hash);
  console.log("StoreFunctions owner:", factory.deployTransaction.from);
  console.log("StoreFunctions chainId:", factory.deployTransaction.chainId);

  try {
    
    verifyBase = async () => { 
      await hre.run("verify:verify", {
      address: base.address,
      constructorArguments: [
        _contractURI,
        _name,
        _client,
        _royaltiesPercentage,
        _royaltiesRecipient,
      ],
      })}
    await verifyBase();
    console.log('BaseContract is verified and published on Etherscan')
  } catch(error){
    console.log('An error occurred while verifying the BaseContract')
  }

  try {

    verifyFactory = async () => await hre.run("verify:verify", {
      address: factory.address,
      constructorArguments: [
        [goBlockchainAddress],
        [GO_FEE],
        base.address,
      ],
    });
    await verifyFactory();
    console.log('StoreFunctions is verified and published on Etherscan')
  } catch(error){
    console.log('An error occurred while verifying the StoreFunctions Contract')
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
