require("@nomiclabs/hardhat-waffle");
require("@openzeppelin/hardhat-upgrades");
module.exports = {
  solidity: "0.8.4",
  networks: {
    ropsten: {
      url: "https://ropsten.infura.io/v3/5dab9b9ec92245a3b7bb2e3138277c5b",
      accounts: [process.env.PRIVATE_KEY],
    },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/f4957760a6aa411d95b81a5822f67a60",
      accounts: [process.env.PRIVATE_KEY],
    },
    matic: {
      url: "https://polygon-rpc.com",
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
