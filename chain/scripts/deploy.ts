import hre from 'hardhat';

const rifAddresses: Record<string, string> = {
  rsktestnet: '0x19f64674D8a5b4e652319F5e239EFd3bc969a1FE',
  rskmainnet: '0x2acc95758f8b5f583470ba265eb685a8f45fc9d5',
};

async function main() {
  try {
    const rifAddress = rifAddresses[hre.network.name]?.toLowerCase();
    if (!rifAddress)
      throw new Error(`RIF is not deployed at ${hre.network.name}`);
    const VoteTokenFactory = await hre.ethers.getContractFactory('VoteToken');
    const voteToken = await VoteTokenFactory.deploy(rifAddress);
    await voteToken.deployed();
    console.log(
      `VoteToken was deployed at ${hre.network.name} with address ${voteToken.address}`,
    );
    const GovernorFactory = await hre.ethers.getContractFactory(
      'RootstockGovernor',
    );
    const rootstockGovernor = await GovernorFactory.deploy(voteToken.address);
    await rootstockGovernor.deployed();
    console.log(
      `RootstockGovernor was deployed at ${hre.network.name} with address ${rootstockGovernor.address}`,
    );
    process.exit(0);
  } catch (error) {
    console.log(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}
main();
