const { version } = require("chai")

require("dotenv").config()
require("@nomiclabs/hardhat-etherscan")
require("@nomiclabs/hardhat-waffle")
require("hardhat-gas-reporter")
require("solidity-coverage")
require("hardhat-deploy")


const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ""
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY


module.exports = {

  solidity: {
    compilers: [{version: "0.8.7"}, {version: "0.6.0"}, {version: "0.6.6"}]
  },

  defaultNetwork: "hardhat",

  networks: {

    rinkeby: {
      url : RINKEBY_RPC_URL,
      accounts:[PRIVATE_KEY],
      chainId: 4,
      blockConfirmations: 10,
      gas: 6000000,
    },

    ropsten: {
        url: process.env.ROPSTEN_URL || "",
        accounts: [],   //Or - process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY]: [],
      },
    },
    gasReporter: {
        enabled: true,
        outputFile: "gas-Report.txt",
        noColors: true,
        currency: "USD",
        coinmarketcap: COINMARKETCAP_API_KEY,
        token: "eth", // "matic", "ftm"  ,etc      :you can put any EVM compatible token here.
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY
    },
    namedAccounts: {
        deployer: {
          default: 0
        },
        user: {
          default: 0
        }
    }
}
