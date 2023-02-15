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
    // deploy RootstockGovernor
    const GovernorFactory = await hre.ethers.getContractFactory(
      'RootstockGovernor',
    );
    const rootstockGovernor = await GovernorFactory.deploy(voteToken.address);
    await rootstockGovernor.deployed();
    console.log(
      `RootstockGovernor was deployed at ${hre.network.name} with address ${rootstockGovernor.address}`,
    );
    // Send some RBTC to Governor treasury for proposal execution testing
    const amount = '0.00001';
    const transferTx = await signers[0].sendTransaction({
      to: rootstockGovernor.address,
      value: hre.ethers.utils.parseEther(amount),
    });
    await transferTx.wait();
    const bal = hre.ethers.utils.formatEther(
      await hre.ethers.provider.getBalance(rootstockGovernor.address),
    );
    console.log(`Sent ${bal} RBTC to RootstockGovernor`);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
main();
