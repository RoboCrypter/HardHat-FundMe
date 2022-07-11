const { expect } = require("chai")
const { getNamedAccounts, ethers, network } = require("hardhat")
const {devChains} = require("../../helper-hardhat-config")

devChains.includes(network.name) ? describe.skip:
describe("Running Staging test on FundMe Contract", async() => {

    let fundMe
    let deployer
    let fundedAmount = ethers.utils.parseEther("0.1")

    beforeEach("Deploying...FundMe Contract", async() => {
        deployer = (await getNamedAccounts()).deployer
        fundMe = await ethers.getContract("FundMe", deployer)
    })

    it("funds and withdraws", async() => {
        console.log(`Initial FundMe Contract Balance: ${await fundMe.provider.getBalance(fundMe.address)}`)
    // lets Fund,
        await fundMe.fund({value: fundedAmount})
        console.log("Funding the Contract is Done....!")

        console.log(`After "Funding" FundMe Contract Balance: ${await fundMe.provider.getBalance(fundMe.address)}`)

    // lets Withdraw,
        await fundMe.withdraw()
        console.log("Withdrawing from the Contract is Done....!")
    
        console.log(`After FundMe Contract Balance: ${await fundMe.provider.getBalance(fundMe.address)}`)
          
    // lets Expect,
        expect(await fundMe.provider.getBalance(fundMe.address)).to.equal(0)
    })

})