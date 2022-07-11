const { network } = require("hardhat")
const {networkConfig, devChainId} = require("../helper-hardhat-config")

// async function testFunc() {
//     hre.getNamedAccounts
//     hre.deployments
// }
// module.exports.default = testFunc

// Or

//module.exports = async (hre) => {
//     const {getNamedAccounts, deployments} = hre
//// Or
//     hre.getNamedAccounts
//     hre.deployments
// }

// Or

module.exports = async ({getNamedAccounts, deployments}) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

   //  ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]

   let ethUsdPriceFeedAddress

   if(chainId == devChainId) {
      const ethUsdAggregator = await deployments.get("MockV3Aggregator")
      ethUsdPriceFeedAddress = ethUsdAggregator.address
   }
   else {
      ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
   }
   

    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeedAddress], // we have to put priceFeedAddress in there, these are basically Constructor args of FundMe Contract.
     // address: [/*accounts*/],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1

    })

    log("-----------------------------------------------------------")

}
module.exports.tags = ["all", "fundMe"]