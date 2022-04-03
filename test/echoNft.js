const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('testing echoNft contract', function () {
  it('mint successed', async function () {
    const echoNftContract = await ethers.getContractFactory('echoNFT');
    const contract = await echoNftContract.deploy();
    await contract.deployed();

    const mint = await contract.mintNFT(1);
    await mint.wait();

    console.log(contract);
  });
});
