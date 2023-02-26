/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useState } from 'react';
import { utils } from 'ethers';
import { Web3Context } from '../context/web3Context';
import { ProposalContext } from '../context/proposalContext';
import getContracts from '../contracts/getContracts';
import './Propose.css';

function Propose() {
  const { address, provider } = useContext(Web3Context);
  const [loading, setLoading] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { proposals, setProposals } = useContext(ProposalContext);

  // competition description
  const [description, setDescription] = useState<string>('');

  const startCompetition = async () => {
    try {
      setErrorMessage('');
      // here can be some validation of proposal parameters
      // e.g. the description should be unique
      if (proposals.some((p) => p.description === description))
        throw new Error(`Proposal already exists`);
      // proposal parameters

      const calldatas: string[] = ['0x']; // empty calldata
      // create a new proposal
      const { governor } = getContracts(provider!);

      setLoading(`Sending proposal creation transaction`);
      // await tx.wait();
      setLoading(`Proposal was created`);
      // save created proposal to context
      /*       setProposals((old) => [
        ...old,
        { addresses, amounts, calldatas, description },
      ]); */
    } catch (error) {
      if (error instanceof Error) setErrorMessage(error.message);
    }
  };

  return (
    <div>
      <h1>Start a new competition</h1>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores
        doloremque modi consequuntur enim totam atque magni dolorum facilis
        perspiciatis deleniti!
      </p>

      <button type="button" onClick={startCompetition}>
        Start
      </button>
      {loading && <p className="loading">{loading}</p>}
      {errorMessage && <p className="error">{errorMessage}</p>}
    </div>
  );
}

export default Propose;
