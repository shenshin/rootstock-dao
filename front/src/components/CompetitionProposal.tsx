import { useContext, useState } from 'react';
import { BigNumber } from 'ethers';
import { Web3Context } from '../context/web3Context';
import {
  ProposalContext,
  getProposalId,
  ProposalType,
} from '../context/proposalContext';
import getContracts from '../contracts/getContracts';
import deployedCompetition from '../contracts/Competition.rsktestnet.address.json';
import './CompetitionProposal.css';

interface ITeamEntry {
  address: string;
  id: number;
}
const teamAddresses: ITeamEntry[] = [
  {
    address: '0xB62BD53308fb2834b3114a5f725D0382CBe9f008',
    id: 1,
  },
  {
    address: '0x0aEd77e54F69a26Ca5bA75755A6ad2c8fB9070bc',
    id: 2,
  },
  {
    address: '0x064304021368BA70ae5a428ebbBf4Cf972edddd0',
    id: 3,
  },
  {
    address: '0x5763e3F82313F863370E41A4fe6514E4Cf653E63',
    id: 4,
  },
  {
    address: '0xD105b7a88cad9CA825C9895Df345eCd20B65656c',
    id: 5,
  },
];

function CompetitionProposal() {
  const { provider } = useContext(Web3Context);
  const [loading, setLoading] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { proposals, setProposals } = useContext(ProposalContext);

  const [description, setDescription] = useState<string>('');
  const [teams, setTeams] = useState<Array<ITeamEntry>>(teamAddresses);

  const startCompetition = async () => {
    try {
      setErrorMessage('');
      if (proposals.some((p) => p.description === description))
        throw new Error(`Proposal already exists`);
      // proposal parameters
      const { governor, competition } = getContracts(provider!);
      const addresses: string[] = [deployedCompetition.address];
      const amounts: BigNumber[] = [BigNumber.from('0')];
      const calldatas: string[] = [
        competition.interface.encodeFunctionData('onCompetitionEnd', [
          description,
          teams.map((a) => a.address),
        ]),
      ];
      // upgraded proposal creation method
      const tx = await governor.createProposal(
        addresses,
        amounts,
        calldatas,
        description,
        ProposalType.Ballot,
      );
      setLoading(`Creating new competition`);
      await tx.wait();
      setLoading(`Competition was created`);

      // save created proposal to context
      const proposalId = getProposalId(
        addresses,
        amounts,
        calldatas,
        description,
      );
      setProposals((old) =>
        old.concat({
          description,
          proposalId,
          addresses,
          amounts,
          calldatas,
          type: ProposalType.Ballot,
        }),
      );
    } catch (error) {
      if (error instanceof Error) setErrorMessage(error.message);
    }
  };

  const onTeamEdit = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTeams((oldTeams) => {
      const newTeams = [...oldTeams];
      newTeams[+e.target.id].address = e.target.value;
      return newTeams;
    });
  const addTeam = () =>
    setTeams((oldTeams) =>
      oldTeams.concat({
        id: oldTeams.length + 1,
        address: teamAddresses[0].address,
      }),
    );
  const removeTeam = () => {
    setTeams((oldTeams) => oldTeams.slice(0, -1));
  };

  return (
    <div>
      <h1>Start a new competition</h1>
      <label htmlFor="competition-description">
        Name{' '}
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          name="competition-description"
          placeholder="enter unique description"
        />
      </label>
      {teams.map((team, i) => (
        <div key={team.id}>
          <label htmlFor={`team-address-${team.id}`}>
            Team {team.id}{' '}
            <input
              type="text"
              value={teams[i].address}
              id={`${i}`}
              onChange={onTeamEdit}
              name={`team-address-${team.id}`}
            />
          </label>
        </div>
      ))}
      <div className="competition-btn-container">
        <button type="button" onClick={startCompetition}>
          Start
        </button>
        <div className="add-remove-btn-container">
          <button type="button" onClick={removeTeam}>
            -
          </button>
          <button type="button" onClick={addTeam}>
            +
          </button>
        </div>
      </div>

      {loading && <p className="loading">{loading}</p>}
      {errorMessage && <p className="error">{errorMessage}</p>}
    </div>
  );
}

export default CompetitionProposal;
