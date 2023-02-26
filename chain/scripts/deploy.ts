import hre from 'hardhat';
import { deploy } from '../util';

async function main() {
  try {
    const { voteToken, governor, competition, awards } = await deploy();
    console.log(
      `VoteToken was deployed at ${hre.network.name} with address ${voteToken.address}`,
    );
    console.log(
      `RootstockGovernor was deployed at ${hre.network.name} with address ${governor.address}`,
    );
    console.log(
      `Competition was deployed at ${hre.network.name} with address ${competition.address}`,
    );
    console.log(
      `Awards was deployed at ${hre.network.name} with address ${awards.address}`,
    );
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
main();
