const {getNamedAccounts, ethers} = require("hardhat")

async function main() {
    const {deployer} = (await getNamedAccounts()).deployer
    const fundMe = await ethers.getContract("FundMe", deployer)

    console.log(`FundMe Contract deployed at Address: ${fundMe.address}`)

// lets Fund,
    console.log("Funding.....!")
    const response = await fundMe.fund({value: ethers.utils.parseEther("1.0")})
    await response.wait()

    console.log(`FundMe Contract Balance: ${await fundMe.provider.getBalance(fundMe.address)}`)

    console.log("Funded.....!")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
