require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.4",
  defaultNetwork: "matic",
  networks: {
    matic: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
