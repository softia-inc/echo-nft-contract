const { expect } = require("chai");

describe("mint nft", function () {
  let contractFactory;
  let contract;
  let owner;
  beforeEach(async function () {
    contractFactory = await ethers.getContractFactory("echoNFT");
    [owner] = await ethers.getSigners();
    contract = await contractFactory.deploy();

    // MEMO: contractの基本情報を確認
    expect(await contract.name()).to.equal("Echo NFT");
    expect(await contract.symbol()).to.equal("ECHO");
    expect(await contract.totalSupply()).to.equal(0);
  });

  it("nft の mint が成功し、作成した nft の token uri が正しく取得できること", async function () {
    const latestTokenId = await contract.getCurrentTokenId();
    expect(await contract.isExistToken(latestTokenId)).to.equal(false);

    // MEMO: nft 作成
    const mint1Tx = await contract
      .connect(owner)
      .mintNFT(latestTokenId, "test TokenURI");
    await mint1Tx.wait();

    // MEMO: nft 作成後の情報を確認
    expect(await contract.tokenURI(latestTokenId)).to.equal("test TokenURI");
    expect(await contract.totalSupply()).to.equal(1);
    expect(await contract.isExistToken(latestTokenId)).to.equal(true);
  });

  it("既に存在する nft id で nft を作成した場合 rollback されること", async function () {
    const latestTokenId = await contract.getCurrentTokenId();
    expect(await contract.totalSupply()).to.equal(0);

    // MEMO: nft 作成
    const mint1Tx = await contract
      .connect(owner)
      .mintNFT(latestTokenId, "test TokenURI");
    await mint1Tx.wait();
    // MEMO: nft 作成後の情報を確認
    expect(await contract.isExistToken(latestTokenId)).to.equal(true);

    // MEMO: 存在するtoken id で nft 作成すると revert されること
    await expect(
      contract.connect(owner).mintNFT(latestTokenId, "test TokenURI")
    ).to.be.reverted;

    expect(await contract.totalSupply()).to.equal(1);
  });
});
