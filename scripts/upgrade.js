const { ethers, upgrades } = require("hardhat");

async function main() {
  const address = "0xe457e0dea4aa752f154F55d3b80070Ffdcc6b0b6";
  // upgrade
  const nft = await ethers.getContractFactory("echoNFT");
  const upgraded = await upgrades.upgradeProxy(address, nft);

  console.log("upgraded:", upgraded);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
