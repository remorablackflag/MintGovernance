const { ethers } = require("hardhat");
const ethProvider = require("eth-provider");

async function main() {

    const myEthProvider = ethProvider(["frame"]);

    myEthProvider.setChain(hre.network.config.chainId);
    const provider = new hre.ethers.providers.Web3Provider(myEthProvider);

    const deployer = await provider.getSigner();
    const deployerAddress = await deployer.getAddress();
    const network = await provider.getNetwork();

    
    console.log("Deploying contracts on chain", network.chainId, "using account", deployerAddress);
    
    const transactionCount = await deployer.getTransactionCount();
    console.log("transactionCount", transactionCount);

    // gets the address of the token before it is deployed
    const futureAddress = ethers.utils.getContractAddress({
        from: deployerAddress,
        nonce: transactionCount + 1
    });

    const MyGovernor = await ethers.getContractFactory("MyGovernor", deployer);
    const governor = await MyGovernor.deploy(futureAddress);

    await governor.deployed();

    const MyToken = await ethers.getContractFactory("MyToken", deployer);
    const token = await MyToken.deploy(governor.address);

    await governor.deployed();

    console.log(
        `Governor deployed to ${governor.address}`,
        `Token deployed to ${token.address}`
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
