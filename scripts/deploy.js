const { ethers, upgrades } = require("hardhat");

async function main() {
  // deploy
  const nft = await ethers.getContractFactory("echoNFT");
  const instance = await upgrades.deployProxy(nft);
  await instance.deployed();

  console.log("echoNFT deployed to:", instance.address);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
