import hre from 'hardhat';
import { deploy } from '../util';

async function main() {
  try {
    const { voteToken, governor, competitions, awards } = await deploy();
    console.log(
      `VoteToken was deployed at ${hre.network.name} with address ${voteToken.address}`,
    );
    console.log(
      `RootstockGovernor was deployed at ${hre.network.name} with address ${governor.address}`,
    );
    console.log(
      `Competitions was deployed at ${hre.network.name} with address ${competitions.address}`,
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
