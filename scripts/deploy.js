const { ethers } = require('hardhat');

async function main() {
  const Nft = await ethers.getContractFactory('echoNFT');
  const nft = await Nft.deploy();

  await nft.deployed();

  console.log('echoNFT deployed to:', nft.address);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
