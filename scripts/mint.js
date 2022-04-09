const { ethers } = require('hardhat');

async function main() {
  
  const ContractAbi = require('../artifacts/contracts/echoNFT.sol/echoNFT.json')
  let provider = ethers.provider;
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
  wallet.provider = provider;
  const signer = wallet.connect(provider);
  const address = '0x91D8F5c8971834b77233E047a4F29E41F9920094'
  const nft = await new ethers.Contract(address, ContractAbi.abi, signer);

  const tokenURI = 'testtest'
  const mint = await nft.mintNFT(tokenURI)
  console.log(mint.to)
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
