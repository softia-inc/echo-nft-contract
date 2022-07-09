const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("token testing", function () {
  let contractFactory;
  let contract;
  let owner, user1, user2, user3;
  beforeEach(async function () {
    contractFactory = await ethers.getContractFactory("echoNFT");
    [owner, user1, user2, user3] = await ethers.getSigners();
    contract = await contractFactory.deploy();

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
    expect(await contract.getCommunityOwner(latestTokenId)).to.equal(owner.address);
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

  it("success bulk mint", async function () {
    const firstTokenId = await contract.getCurrentTokenId();
    const lastTokenId = Number(firstTokenId) + 99;

    // MEMO: mint token
    const mintTx = await contract
      .connect(owner)
      .bulkMint(100, firstTokenId, "test TokenURI", {gasPrice: ethers.utils.parseUnits('100', 'gwei'), gasLimit: 30000000 } );
    await mintTx.wait();

    // MEMO: token info
    expect(await contract.tokenURI(firstTokenId)).to.equal("test TokenURI");
    expect(await contract.tokenURI(lastTokenId)).to.equal("test TokenURI");
    expect(await contract.totalSupply()).to.equal(100);
    expect(await contract.isExistToken(firstTokenId)).to.equal(true);
    expect(await contract.isExistToken(lastTokenId)).to.equal(true);
    expect(await contract.balanceOf(owner.address)).to.equal(100);
    expect(await contract.ownerOf(firstTokenId)).to.equal(owner.address);
    expect(await contract.ownerOf(lastTokenId)).to.equal(owner.address);
  });

  it("failed bulk mint: out of amount or 0", async function () {
    const firstTokenId = await contract.getCurrentTokenId();

    // MEMO: mint token
    try { 
      await contract
      .connect(owner)
      .bulkMint(101, firstTokenId, "test TokenURI", {gasPrice: ethers.utils.parseUnits('100', 'gwei'), gasLimit: 30000000 } );
      await mintTx.wait();
    } catch(e) {
      return;
    }

    // MEMO: expect tokens haven't been minted.
    expect(await contract.isExistToken(firstTokenId)).to.equal(false);
    expect(await contract.balanceOf(owner.address)).to.equal(0);

    // MEMO: mint token
    try { 
      await contract
      .connect(owner)
      .bulkMint(0, firstTokenId, "test TokenURI", {gasPrice: ethers.utils.parseUnits('100', 'gwei'), gasLimit: 30000000 } );
      await mintTx.wait();
    } catch(e) {
      return;
    }

    // MEMO: expect tokens haven't been minted.
    expect(await contract.isExistToken(firstTokenId)).to.equal(false);
    expect(await contract.balanceOf(owner.address)).to.equal(0);
  });

  it("execute bulk mint and mint in a series", async function () {
    const buklkfirstTokenId = await contract.getCurrentTokenId();
    const singleMintedTokenId = Number(buklkfirstTokenId) + 10;

    // MEMO: mint token
    const bulkTx = contract
      .connect(owner)
      .bulkMint(10, buklkfirstTokenId, "test TokenURI", {gasPrice: ethers.utils.parseUnits('100', 'gwei'), gasLimit: 30000000 } );

    // MEMO: mint token
    const mintTx = await contract
      .connect(user1)
      .mint(singleMintedTokenId, "test TokenURI", {gasPrice: ethers.utils.parseUnits('100', 'gwei'), gasLimit: 30000000 } );

    // MEMO: token info
    expect(await contract.totalSupply()).to.equal(11);
    expect(await contract.balanceOf(owner.address)).to.equal(10);
    expect(await contract.balanceOf(user1.address)).to.equal(1);
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

  it("change community owner", async function() {
    const TokenId1 = await contract.getCurrentTokenId();
    const TokenId2 = Number(TokenId1) + 1;
    const TokenId3 = Number(TokenId1) + 2;

    // MEMO: mint token
    const mintTx = await contract
      .connect(owner)
      .bulkMint(3, TokenId1, "test TokenURI");
    await mintTx.wait();

    // MEMO: token info
    expect(await contract.getCommunityOwner(TokenId1)).to.equal(owner.address);
    expect(await contract.getCommunityOwner(TokenId2)).to.equal(owner.address);
    expect(await contract.getCommunityOwner(TokenId3)).to.equal(owner.address);

    const changeOwnerTx = await contract
      .connect(owner)
      .setCommunityOwner([TokenId1,TokenId2,TokenId3], user1.address);
    await changeOwnerTx.wait();

    expect(await contract.getCommunityOwner(TokenId1)).to.equal(user1.address);
    expect(await contract.getCommunityOwner(TokenId2)).to.equal(user1.address);
    expect(await contract.getCommunityOwner(TokenId3)).to.equal(user1.address);
  })

  it("failed change community owner", async function() {
    const TokenId1 = await contract.getCurrentTokenId();
    const TokenId2 = Number(TokenId1) + 1;
    const TokenId3 = Number(TokenId1) + 2;

    // MEMO: mint token
    const mintTx = await contract
      .connect(owner)
      .bulkMint(3, TokenId1, "test TokenURI");
    await mintTx.wait();

    // MEMO: token info
    expect(await contract.getCommunityOwner(TokenId1)).to.equal(owner.address);
    expect(await contract.getCommunityOwner(TokenId2)).to.equal(owner.address);
    expect(await contract.getCommunityOwner(TokenId3)).to.equal(owner.address);

    try {
      await contract
      .connect(user1)
      .setCommunityOwner([TokenId1,TokenId2,TokenId3], user1.address, {gasPrice: ethers.utils.parseUnits('100', 'gwei'), gasLimit: 30000000 });
    } catch {
      return;
    }
    // Cannot changed community owner by address isn't owner's 
    expect(await contract.getCommunityOwner(TokenId1)).to.equal(owner.address);
    expect(await contract.getCommunityOwner(TokenId2)).to.equal(owner.address);
    expect(await contract.getCommunityOwner(TokenId3)).to.equal(owner.address);
  })
});
