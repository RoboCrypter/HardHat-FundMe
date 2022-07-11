const { expect } = require("chai")
const {deployments, ethers, getNamedAccounts, network} = require("hardhat")
const {devChains} = require("../../helper-hardhat-config")

!devChains.includes(network.name) ? describe.skip:

describe("Running Unit test on FundMe Contract", async () => {

    let fundMe
    let deployer
    let mockV3Aggregator
    let fundedAmount = ethers.utils.parseEther("1") // :  this is for "bigNumber" conversion.


    beforeEach("deploying the FundMe contract", async () => {
    //    const accounts = await ethers.getSigner()
    //    const accountZero = accounts[0]              :this is if you wanna test it on a specific "account"
       deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
       fundMe = await ethers.getContract("FundMe", deployer)
       mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer)
    })

    describe("constructor", async () => {
    it( "It will give us the correct PriceFeed" , async () => {
        const response = await fundMe.getPriceFeed()
        expect(response).to.equal(mockV3Aggregator.address)
     })
    })

    describe("fund", async () => {
        it("Should send more than the minimum amount of ETH", async () => {
        //  await expect(fundMe.fund()).to.be.reverted
        /// Or with error Statement,
            await expect(fundMe.fund()).to.be.revertedWith("Less_Than_Minimum_Amount()")
        })

        it("Should update funder to their funded amount", async () => {
            await fundMe.fund({value: fundedAmount})
            const response = await fundMe.getAmountToFunders(deployer)
        
            expect(response.toString()).to.equal(fundedAmount.toString())
        })

        it("Should add funder to array of s_funders", async () => {
            await fundMe.fund({value: fundedAmount})
            const response = await fundMe.getFunders(0)

            expect(response).to.equal(deployer)
        })
    })

    describe("withdraw", async () => {           //: for withdraw you should have some fund in your contract
        beforeEach("funding the contract first", async () =>{
            await fundMe.fund({value: fundedAmount})
        })

        it("Should withdraw to the contract deployer", async() => {
            // first lets Arrage
            const postFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
            const postDeployerBalance = await fundMe.provider.getBalance(deployer)

            // now, lets move to Response
            const response = await fundMe.withdraw()
            const txRecipt = await response.wait(1)
            // lets get the gas price from our txRecipt 
            const {gasUsed, effectiveGasPrice} = txRecipt
            // to get the gas price we have to multiply gasUsed to effectiveGasPrice
            const gasPrice = gasUsed.mul(effectiveGasPrice)  // .mul is for BigNumbers

            // lets check ending balances,
            const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
            const endingDeployerBalance = await fundMe.provider.getBalance(deployer)

            // now lets Expect,
            expect(endingFundMeBalance).to.equal(0)
            expect(postFundMeBalance.add(postDeployerBalance).toString()).to.equal(endingDeployerBalance.add(gasPrice).toString())
        })

        it("Should add multiple funders to s_funders array", async () => {
            // lets Arrange
            const accounts = await ethers.getSigners()

            for(i = 1; i < 6; i++) {
                const fundMeConnectedfunders = await fundMe.connect(accounts[i])
                await fundMeConnectedfunders.fund({value: fundedAmount})
            }

           
           // lets take Response
            const postFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
            const postDeployerBalance = await fundMe.provider.getBalance(deployer)

            const response = await fundMe.withdraw()
            const txRecipt = await response.wait(1)

            const {gasUsed, effectiveGasPrice} = txRecipt
            const gasPrice = gasUsed.mul(effectiveGasPrice)

            const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
            const endingDeployerBalance = await fundMe.provider.getBalance(deployer)

            // lets Expect now,
            expect(endingFundMeBalance).to.equal(0)
            expect(postFundMeBalance.add(postDeployerBalance).toString()).to.equal(endingDeployerBalance.add(gasPrice).toString())

            await expect(fundMe.getFunders(0)).to.be.reverted

            for(i = 1; i < 6; i++) {
                expect(await fundMe.getAmountToFunders(accounts[i].address)).to.equal(0)
            }
        })

        it("Only Owner can withdraw the funds", async () => {
            const accounts = await ethers.getSigners()
            const notOwner = accounts[1]
            const notOwnerConnectedToWithdraw = await fundMe.connect(notOwner)
             
            await expect(notOwnerConnectedToWithdraw.withdraw()).to.be.revertedWith("FundMe__Not_Owner_FBI_OPEN_UP")
         })
    })

    describe("cheaperWithdraw", async () => {           //: for withdraw you should have some fund in your contract
        beforeEach("funding the contract first", async () =>{
            await fundMe.fund({value: fundedAmount})
        })

        it("Should Cheap_Withdraw to the contract deployer", async() => {
            // first lets Arrage
            const postFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
            const postDeployerBalance = await fundMe.provider.getBalance(deployer)

            // now, lets move to Response
            const response = await fundMe.cheaperWithdraw()
            const txRecipt = await response.wait(1)
            // lets get the gas price from our txRecipt 
            const {gasUsed, effectiveGasPrice} = txRecipt
            // to get the gas price we have to multiply gasUsed to effectiveGasPrice
            const gasPrice = gasUsed.mul(effectiveGasPrice)  // .mul is for BigNumbers

            // lets check ending balances,
            const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
            const endingDeployerBalance = await fundMe.provider.getBalance(deployer)

            // now lets Expect,
            expect(endingFundMeBalance).to.equal(0)
            expect(postFundMeBalance.add(postDeployerBalance).toString()).to.equal(endingDeployerBalance.add(gasPrice).toString())
        })

        it("Should add multiple funders to s_funders array", async () => {
            // lets Arrange
            const accounts = await ethers.getSigners()

            for(i = 1; i < 6; i++) {
                const fundMeConnectedfunders = await fundMe.connect(accounts[i])
                await fundMeConnectedfunders.fund({value: fundedAmount})
            }

           
           // lets take Response
            const postFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
            const postDeployerBalance = await fundMe.provider.getBalance(deployer)

            const response = await fundMe.cheaperWithdraw()
            const txRecipt = await response.wait(1)

            const {gasUsed , effectiveGasPrice} = txRecipt
            const gasPrice = gasUsed.mul(effectiveGasPrice)

            const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
            const endingDeployerBalance = await fundMe.provider.getBalance(deployer)

            // lets Expect now,
            expect(endingFundMeBalance).to.equal(0)
            expect(postFundMeBalance.add(postDeployerBalance).toString()).to.equal(endingDeployerBalance.add(gasPrice).toString())

            await expect(fundMe.getFunders(0)).to.be.reverted

            for(i = 1; i < 6; i++) {
                expect(await fundMe.getAmountToFunders(accounts[i].address)).to.equal(0)
            } 
        })

        it("Only Owner can Cheap_Withdraw the funds", async () => {
            const accounts = await ethers.getSigners()
            const notOwner = accounts[1]
            const notOwnerConnectedToWithdraw = await fundMe.connect(notOwner)
             
            await expect(notOwnerConnectedToWithdraw.cheaperWithdraw()).to.be.revertedWith("FundMe__Not_Owner_FBI_OPEN_UP")
         })
    })
})