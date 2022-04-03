const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('echoNft', function () {
  it("Should return the new greeting once it's changed", async function () {
    const echoNftContract = await ethers.getContractFactory('echoNFT');
    const contract = await echoNftContract.deploy();
    await contract.deployed();
    // expect(await greeter.greet()).to.equal('Hello, world!');

    // const setGreetingTx = await greeter.setGreeting('Hola, mundo!');

    // // wait until the transaction is mined
    // await setGreetingTx.wait();

    // expect(await greeter.greet()).to.equal('Hola, mundo!');
  });
});
