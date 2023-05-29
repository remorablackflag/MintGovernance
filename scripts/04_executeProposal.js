const { ethers } = require('hardhat');
const { keccak256, toUtf8Bytes, parseEther, formatEther } = ethers.utils;
const ethProvider = require("eth-provider");

const tokenAddress = '0x4Ec715237180aD276F1c49973026B0332369789c';
const governorAddress = '0xC3399923CA0923D010644D2a2aE376344521AD87';

const proposalId = ethers.BigNumber.from("73511725240778866684354958604250748594601064951020744821967232561283179157737");

async function main() {

    const myEthProvider = ethProvider(["frame"]);

    myEthProvider.setChain(hre.network.config.chainId);
    const provider = new hre.ethers.providers.Web3Provider(myEthProvider);

    const deployer = await provider.getSigner();
    const deployerAddress = await deployer.getAddress();
    const network = await provider.getNetwork();

    console.log("Executing proposal on chain", network.chainId, ", account", deployerAddress);

    const governor = await ethers.getContractAt('MyGovernor', governorAddress);
    const token = await ethers.getContractAt('MyToken', tokenAddress);

    const tx = await governor.connect(deployer).execute(
        [token.address],
        [0],
        [token.interface.encodeFunctionData("mint", [deployerAddress, parseEther("420")])],
        keccak256(toUtf8Bytes("Give the owner 420!"))
    );

    const receipt = await tx.wait();

    const balance = await tokens.balanceOf(deployerAddress);

    console.log("Proposal executed. Proposer's token balance: ",formatEther(balance));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
