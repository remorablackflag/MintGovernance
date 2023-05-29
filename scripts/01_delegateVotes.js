const { ethers } = require('hardhat');
const ethProvider = require("eth-provider");

const tokenAddress = '0x4Ec715237180aD276F1c49973026B0332369789c';

async function main() {

    const myEthProvider = ethProvider(["frame"]);

    myEthProvider.setChain(hre.network.config.chainId);
    const provider = new hre.ethers.providers.Web3Provider(myEthProvider);

    const deployer = await provider.getSigner();
    const deployerAddress = await deployer.getAddress();
    const network = await provider.getNetwork();

    console.log("Delegating votes on chain", network.chainId, "to account", deployerAddress);

    const token = await ethers.getContractAt('MyToken', tokenAddress);

    const tx = await token.connect(deployer).delegate(deployerAddress);

    const receipt = await tx.wait();

    console.log("Finished. Receipt:", receipt);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
