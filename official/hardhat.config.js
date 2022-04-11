/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-truffle5");
require("@nomiclabs/hardhat-ganache");
require("@nomiclabs/hardhat-etherscan");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  defaultNetwork: "ganache",
  networks: {
    ganache: {
      url: "http://127.0.0.1:8545",
      gasLimit: 6000000000,
      defaultBalanceEther: 10,
    },
    localhost: {
      url: "http://127.0.0.1:7545",
      accounts: [process.env.PRIV_KEY]
    },
    rinkeby: {
      url: process.env.RINKEBY,
      accounts: [process.env.PRIV_KEY]
    },
    polygon: {
      url: process.env.POLYGON,
      accounts: [process.env.PRIV_KEY]
    },
    mumbai: {
      url: process.env.MUMBAI,
      accounts: [process.env.PRIV_KEY]
    },
    mainnet: {
      url: process.env.ETHEREUM_MAINNET,
      accounts: [process.env.PRIV_KEY]
    }
  },
  solidity: {
    version: "0.8.10",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_ETHEREUM,
      rinkeby: process.env.ETHERSCAN_RINKEBY,
      polygon: process.env.POLYGONSCAN_POLYGON,
      polygonMumbai: process.env.POLYGONSCAN_MUMBAI,
    }
  }
};
