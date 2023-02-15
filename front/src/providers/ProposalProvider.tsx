import { useState } from 'react';
import { ProposalContext, IProposal } from '../context/proposalContext';

interface ProposalProviderProps {
  children: React.ReactNode;
}

function ProposalProvider({ children }: ProposalProviderProps) {
  const [proposals, setProposals] = useState<Array<IProposal>>([]);
  return (
    <ProposalContext.Provider value={{ proposals, setProposals }}>
      {children}
    </ProposalContext.Provider>
  );
}

export default ProposalProvider;
