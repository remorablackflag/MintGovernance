require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.17",
    defaultNetwork: "hardhat",
    networks: {
      hardhat: {
          chainId: 31337
      },
      goerli: {
          chainId: 5,
          url: `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`
      }
    },
    etherscan: {
        apiKey: {
            goerli: process.env.ETHERSCAN_KEY
        }
    }
};
