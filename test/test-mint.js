const { expect } = require("chai");
describe("echoNFT contract", function () {

  it("Deployment should assign the total supply of echoNFTs to the owner", async function () {
    const [owner] = await ethers.getSigners();
    const echoNFT = await ethers.getContractFactory("echoNFT");
    const hardhatEchoNFT = await echoNFT.deploy();
    const ownerBalance = await hardhatEchoNFT.balanceOf(owner.address);
   expect(await hardhatEchoNFT.totalSupply()).to.equal(ownerBalance);
 });

 it("_safeMint()が実行されている。", async function () {
  const [owner] = await ethers.getSigners();
  const echoNFT = await ethers.getContractFactory("echoNFT");
  const hardhatEchoNFT = await echoNFT.deploy();
  const tokenURI = 'test TokenURI'
  const mint = await hardhatEchoNFT.mintNFT(tokenURI);
 expect(mint.from).to.equal(owner.address);
});
});
