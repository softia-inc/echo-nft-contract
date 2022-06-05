require("@nomiclabs/hardhat-waffle");
require("@openzeppelin/hardhat-upgrades");
module.exports = {
  solidity: "0.8.4",
  networks: {
    ropsten: {
      url: "https://ropsten.infura.io/v3/f3817857cc6e4679907a60270c5d1763",
      accounts: [process.env.PRIVATE_KEY],
    },
    matic: {
      url: "https://polygon-rpc.com",
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
