const { ethers } = require('hardhat');
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

    console.log("Casting vote on chain", network.chainId, "with account", deployerAddress);

    const governor = await ethers.getContractAt('MyGovernor', governorAddress);
    const token = await ethers.getContractAt('MyToken', tokenAddress);

    const tx = await governor.connect(deployer).castVote(proposalId, 1);

    const receipt = await tx.wait();

    const event = receipt.events.find(x => x.event === 'VoteCast');

    console.log("Vote casted with weight: ", event.args.weight.toString());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
