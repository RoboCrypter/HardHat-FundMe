const { network } = require("hardhat")
const { devNetworks, DECIMALS, INITIAL_ANSWER } = require("../helper-hardhat-config")

// module.exports = async (hre) => {        // "hre" is called "hardhat run time enviroment".
//     hre.deployments
//     hre.getNamedAccounts

// Or

module.exports = async ({getNamedAccounts, deployments}) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    if (devNetworks.includes(network.name)) {
        log("Dev_Networks Detected....deploying")      // Or "console.log"  are the same thing.

        await deploy("MockV3Aggregator", {
            from: deployer,
            log: true,
            args:[DECIMALS, INITIAL_ANSWER]
        })

        log("Mocks Deployed")
        log("------------------------------------------------------------------")
    }
}

module.exports.tags = ["all", "mocks"]
