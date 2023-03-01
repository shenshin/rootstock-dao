import { useState } from 'react';
import { ProposalContext, IProposal } from '../context/proposalContext';

function ProposalProvider({ children }: { children: React.ReactNode }) {
  const [proposals, setProposals] = useState<Array<IProposal>>([]);
  return (
    <ProposalContext.Provider value={{ proposals, setProposals }}>
      {children}
    </ProposalContext.Provider>
  );
}

export default ProposalProvider;
