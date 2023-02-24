import hre from 'hardhat';

async function main() {
  try {
    // deploy VoteToken NFT smart contract
    const VoteTokenFactory = await hre.ethers.getContractFactory('VoteToken');
    const voteToken = await VoteTokenFactory.deploy();
    await voteToken.deployed();
    console.log(
      `VoteToken was deployed at ${hre.network.name} with address ${voteToken.address}`,
    );
    // mint some NFTs
    const signers = await hre.ethers.getSigners();
    const tx = await voteToken.safeMintBatch(signers.map((s) => s.address));
    const receipt = await tx.wait();
    console.log(`Minted VoteToke NFTs to addresses:`);
    receipt.events?.forEach((event) => {
      if ('tokenId' in event.args!)
        console.log(`ID # ${event.args.tokenId}, to: ${event.args.to}`);
    });
    // deploy GovernorBallot
    const GovernorFactory = await hre.ethers.getContractFactory(
      'GovernorBallot',
    );
    const governor = await GovernorFactory.deploy(voteToken.address);
    await governor.deployed();
    console.log(
      `GovernorBallot was deployed at ${hre.network.name} with address ${governor.address}`,
    );
    // Send some RBTC to Governor treasury for proposal execution testing
    const amount = '0.00001';
    const transferTx = await signers[0].sendTransaction({
      to: governor.address,
      value: hre.ethers.utils.parseEther(amount),
    });
    await transferTx.wait();
    const bal = hre.ethers.utils.formatEther(
      await hre.ethers.provider.getBalance(governor.address),
    );
    console.log(`Sent ${bal} RBTC to RootstockGovernor`);
    // deploy Competitions
    const CompetitionsFactory = await hre.ethers.getContractFactory(
      'Competitions',
    );
    const competitions = await CompetitionsFactory.deploy(governor.address);
    await competitions.deployed();
    console.log(
      `Competitions was deployed at ${hre.network.name} with address ${competitions.address}`,
    );
    // deploy Awards
    const AwardsFactory = await hre.ethers.getContractFactory('Awards');
    const awards = await AwardsFactory.deploy(competitions.address);
    await awards.deployed();
    await competitions.setAwards(awards.address);
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
