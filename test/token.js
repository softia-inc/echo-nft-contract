const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("token testing", function () {
  let contractFactory;
  let contract;
  let owner, user1, user2, user3;
  beforeEach(async function () {
    contractFactory = await ethers.getContractFactory("echoNFT");
    [owner, user1, user2, user3] = await ethers.getSigners();
    const instance = await upgrades.deployProxy(contractFactory);
    contract = await instance.deployed();

    // MEMO: contract basic info
    expect(await contract.name()).to.equal("Echo NFT");
    expect(await contract.symbol()).to.equal("ECHO");
    expect(await contract.totalSupply()).to.equal(0);
    expect(await contract.balanceOf(owner.address)).to.equal(0);
  });

  it("success mint", async function () {
    const latestTokenId = await contract.getCurrentTokenId();
    expect(await contract.isExistToken(latestTokenId)).to.equal(false);

    // MEMO: mint token
    const mintTx = await contract
      .connect(owner)
      .mint(latestTokenId, "test TokenURI");
    await mintTx.wait();

    // MEMO: token info
    expect(await contract.tokenURI(latestTokenId)).to.equal("test TokenURI");
    expect(await contract.totalSupply()).to.equal(1);
    expect(await contract.isExistToken(latestTokenId)).to.equal(true);
    expect(await contract.balanceOf(owner.address)).to.equal(1);
    expect(await contract.ownerOf(latestTokenId)).to.equal(owner.address);
  });

  it("revert transaction if exists same token id", async function () {
    const tokenId1 = await contract.getCurrentTokenId();
    expect(await contract.totalSupply()).to.equal(0);
    expect(await contract.balanceOf(owner.address)).to.equal(0);

    // MEMO: mint token
    const mintTx = await contract
      .connect(owner)
      .mint(tokenId1, "test TokenURI");
    await mintTx.wait();

    // MEMO: token info
    expect(await contract.tokenURI(tokenId1)).to.equal("test TokenURI");
    expect(await contract.totalSupply()).to.equal(1);
    expect(await contract.isExistToken(tokenId1)).to.equal(true);
    expect(await contract.balanceOf(owner.address)).to.equal(1);
    expect(await contract.ownerOf(tokenId1)).to.equal(owner.address);

    // MEMO: revert transaction because exists same token id
    await expect(contract.connect(owner).mint(tokenId1, "test TokenURI")).to.be
      .reverted;
  });

  it("burn token", async function () {
    const tokenId1 = await contract.getCurrentTokenId();
    expect(await contract.totalSupply()).to.equal(0);
    expect(await contract.balanceOf(owner.address)).to.equal(0);

    // MEMO: mint token
    const mintTx = await contract
      .connect(owner)
      .mint(tokenId1, "test TokenURI");
    await mintTx.wait();

    // MEMO: token info
    expect(await contract.tokenURI(tokenId1)).to.equal("test TokenURI");
    expect(await contract.totalSupply()).to.equal(1);
    expect(await contract.isExistToken(tokenId1)).to.equal(true);
    expect(await contract.balanceOf(owner.address)).to.equal(1);
    expect(await contract.ownerOf(tokenId1)).to.equal(owner.address);

    // MEMO: burn token from owner
    const burn = await contract.connect(owner).burn(tokenId1);
    await burn.wait();
    // MEMO: token info
    expect(await contract.isExistToken(tokenId1)).to.equal(false);
    expect(await contract.balanceOf(owner.address)).to.equal(0);
    expect(await contract.totalSupply()).to.equal(0);
  });

  it("can't burn if isn't owner", async function () {
    const tokenId1 = await contract.getCurrentTokenId();
    expect(await contract.totalSupply()).to.equal(0);
    expect(await contract.balanceOf(owner.address)).to.equal(0);

    // MEMO: mint token
    const mintTx = await contract
      .connect(owner)
      .mint(tokenId1, "test TokenURI");
    await mintTx.wait();

    // MEMO: token info
    expect(await contract.tokenURI(tokenId1)).to.equal("test TokenURI");
    expect(await contract.totalSupply()).to.equal(1);
    expect(await contract.isExistToken(tokenId1)).to.equal(true);
    expect(await contract.balanceOf(owner.address)).to.equal(1);
    expect(await contract.ownerOf(tokenId1)).to.equal(owner.address);

    // MEMO: burn token from isn't owner
    await expect(contract.connect(user1.address).burn(tokenId1)).to.be.reverted;
  });

  it("success transfer from owner", async function () {
    const tokenId1 = await contract.getCurrentTokenId();
    expect(await contract.totalSupply()).to.equal(0);
    expect(await contract.balanceOf(owner.address)).to.equal(0);

    // MEMO: mint token
    const mintTx = await contract
      .connect(owner)
      .mint(tokenId1, "test TokenURI");
    await mintTx.wait();

    // MEMO: token info
    expect(await contract.tokenURI(tokenId1)).to.equal("test TokenURI");
    expect(await contract.totalSupply()).to.equal(1);
    expect(await contract.isExistToken(tokenId1)).to.equal(true);
    expect(await contract.balanceOf(owner.address)).to.equal(1);
    expect(await contract.ownerOf(tokenId1)).to.equal(owner.address);

    // MEMO: transfer token from owner
    const transferTx = await contract
      .connect(owner)
      .transferFrom(owner.address, user1.address, tokenId1);
    await transferTx.wait();

    // MEMO: token info
    expect(await contract.tokenURI(tokenId1)).to.equal("test TokenURI");
    expect(await contract.isExistToken(tokenId1)).to.equal(true);
    expect(await contract.balanceOf(owner.address)).to.equal(0);
    expect(await contract.ownerOf(tokenId1)).to.equal(user1.address);
    expect(await contract.balanceOf(user1.address)).to.equal(1);
    expect(await contract.totalSupply()).to.equal(1);
  });

  it("success mint", async function () {
    const latestTokenId = await contract.getCurrentTokenId();
    expect(await contract.isExistToken(latestTokenId)).to.equal(false);

    // MEMO: mint token
    const mintTx = await contract
      .connect(owner)
      .mint(latestTokenId, "test TokenURI");
    await mintTx.wait();

    // MEMO: token info
    expect(await contract.tokenURI(latestTokenId)).to.equal("test TokenURI");
    expect(await contract.totalSupply()).to.equal(1);
    expect(await contract.isExistToken(latestTokenId)).to.equal(true);
    expect(await contract.balanceOf(owner.address)).to.equal(1);
    expect(await contract.ownerOf(latestTokenId)).to.equal(owner.address);

    // upgrade contract
    contractFactory = await ethers.getContractFactory("echoNFT");
    const contractV2 = await upgrades.upgradeProxy(
      contract.address,
      contractFactory
    );

    // MEMO: contract basic info
    expect(await contractV2.name()).to.equal("Echo NFT");
    expect(await contractV2.symbol()).to.equal("ECHO");
    expect(await contractV2.totalSupply()).to.equal(1);
    expect(await contractV2.balanceOf(owner.address)).to.equal(1);

    // MEMO: mint
    const latestTokenId2 = await contractV2.getCurrentTokenId();
    expect(await contractV2.isExistToken(latestTokenId2)).to.equal(false);

    // MEMO: mint token
    const mintTx2 = await contractV2
      .connect(owner)
      .mint(latestTokenId2, "test TokenURI v2");
    await mintTx2.wait();

    // MEMO: token info
    expect(await contractV2.tokenURI(latestTokenId2)).to.equal(
      "test TokenURI v2"
    );
    expect(await contractV2.totalSupply()).to.equal(2);
    expect(await contractV2.isExistToken(latestTokenId2)).to.equal(true);
    expect(await contractV2.balanceOf(owner.address)).to.equal(2);
    expect(await contractV2.ownerOf(latestTokenId2)).to.equal(owner.address);
  });
});
