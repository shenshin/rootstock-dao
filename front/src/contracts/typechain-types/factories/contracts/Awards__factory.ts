/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type { Awards, AwardsInterface } from "../../contracts/Awards";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract Competition",
        name: "_competition",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "competitionName",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "votingResult",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint8",
        name: "rank",
        type: "uint8",
      },
    ],
    name: "givePrize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "prizes",
    outputs: [
      {
        internalType: "string",
        name: "competitionName",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "votingResult",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "rank",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60a06040523480156200001157600080fd5b50604051620019c3380380620019c3833981016040819052620000349162000152565b604080518082018252600a81526920bbb0b9322a37b5b2b760b11b6020808301918252835180850190945260038452621055d160ea1b9084015281519192916200008191600091620000ac565b50805162000097906001906020840190620000ac565b5050506001600160a01b0316608052620001c1565b828054620000ba9062000184565b90600052602060002090601f016020900481019282620000de576000855562000129565b82601f10620000f957805160ff191683800117855562000129565b8280016001018555821562000129579182015b82811115620001295782518255916020019190600101906200010c565b50620001379291506200013b565b5090565b5b808211156200013757600081556001016200013c565b6000602082840312156200016557600080fd5b81516001600160a01b03811681146200017d57600080fd5b9392505050565b600181811c908216806200019957607f821691505b60208210811415620001bb57634e487b7160e01b600052602260045260246000fd5b50919050565b6080516117e6620001dd60003960006104b401526117e66000f3fe608060405234801561001057600080fd5b50600436106100f55760003560e01c80636352211e11610097578063b88d4fde11610066578063b88d4fde146101ff578063c87b56dd14610212578063e985e9c514610225578063eccb3a4f1461026157600080fd5b80636352211e146101b057806370a08231146101c357806395d89b41146101e4578063a22cb465146101ec57600080fd5b8063095ea7b3116100d3578063095ea7b3146101625780630e54ef101461017757806323b872dd1461018a57806342842e0e1461019d57600080fd5b806301ffc9a7146100fa57806306fdde0314610122578063081812fc14610137575b600080fd5b61010d610108366004611217565b610283565b60405190151581526020015b60405180910390f35b61012a6102d5565b604051610119919061128c565b61014a61014536600461129f565b610367565b6040516001600160a01b039091168152602001610119565b6101756101703660046112d4565b61038e565b005b6101756101853660046112fe565b6104a9565b6101756101983660046113a2565b61060c565b6101756101ab3660046113a2565b61063d565b61014a6101be36600461129f565b610658565b6101d66101d13660046113de565b6106b8565b604051908152602001610119565b61012a61073e565b6101756101fa3660046113f9565b61074d565b61017561020d36600461144b565b61075c565b61012a61022036600461129f565b610794565b61010d610233366004611527565b6001600160a01b03918216600090815260056020908152604080832093909416825291909152205460ff1690565b61027461026f36600461129f565b610808565b6040516101199392919061155a565b60006001600160e01b031982166380ac58cd60e01b14806102b457506001600160e01b03198216635b5e139f60e01b145b806102cf57506301ffc9a760e01b6001600160e01b03198316145b92915050565b6060600080546102e490611586565b80601f016020809104026020016040519081016040528092919081815260200182805461031090611586565b801561035d5780601f106103325761010080835404028352916020019161035d565b820191906000526020600020905b81548152906001019060200180831161034057829003601f168201915b5050505050905090565b6000610372826108b6565b506000908152600460205260409020546001600160a01b031690565b600061039982610658565b9050806001600160a01b0316836001600160a01b0316141561040c5760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b60648201526084015b60405180910390fd5b336001600160a01b038216148061042857506104288133610233565b61049a5760405162461bcd60e51b815260206004820152603d60248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f7420746f60448201527f6b656e206f776e6572206f7220617070726f76656420666f7220616c6c0000006064820152608401610403565b6104a48383610918565b505050565b336001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161461052b5760405162461bcd60e51b815260206004820152602160248201527f43616e2062652063616c6c6564206f6e6c7920627920436f6d7065746974696f6044820152603760f91b6064820152608401610403565b60008585848460405160200161054494939291906115c1565b6040516020818303038152906040528051906020012060001c90506105698382610986565b604051806060016040528087878080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920182905250938552505050602080830188905260ff8616604093840152848252600681529190208251805191926105dd92849290910190611168565b50602082015160018201556040909101516002909101805460ff191660ff909216919091179055505050505050565b61061633826109a0565b6106325760405162461bcd60e51b8152600401610403906115fe565b6104a4838383610a1f565b6104a48383836040518060200160405280600081525061075c565b6000818152600260205260408120546001600160a01b0316806102cf5760405162461bcd60e51b8152602060048201526018602482015277115490cdcc8c4e881a5b9d985b1a59081d1bdad95b88125160421b6044820152606401610403565b60006001600160a01b0382166107225760405162461bcd60e51b815260206004820152602960248201527f4552433732313a2061646472657373207a65726f206973206e6f7420612076616044820152683634b21037bbb732b960b91b6064820152608401610403565b506001600160a01b031660009081526003602052604090205490565b6060600180546102e490611586565b610758338383610b90565b5050565b61076633836109a0565b6107825760405162461bcd60e51b8152600401610403906115fe565b61078e84848484610c5f565b50505050565b606061079f826108b6565b60006107b660408051602081019091526000815290565b905060008151116107d65760405180602001604052806000815250610801565b806107e084610c92565b6040516020016107f192919061164b565b6040516020818303038152906040525b9392505050565b60066020526000908152604090208054819061082390611586565b80601f016020809104026020016040519081016040528092919081815260200182805461084f90611586565b801561089c5780601f106108715761010080835404028352916020019161089c565b820191906000526020600020905b81548152906001019060200180831161087f57829003601f168201915b50505050600183015460029093015491929160ff16905083565b6000818152600260205260409020546001600160a01b03166109155760405162461bcd60e51b8152602060048201526018602482015277115490cdcc8c4e881a5b9d985b1a59081d1bdad95b88125160421b6044820152606401610403565b50565b600081815260046020526040902080546001600160a01b0319166001600160a01b038416908117909155819061094d82610658565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b610758828260405180602001604052806000815250610d2f565b6000806109ac83610658565b9050806001600160a01b0316846001600160a01b031614806109f357506001600160a01b0380821660009081526005602090815260408083209388168352929052205460ff165b80610a175750836001600160a01b0316610a0c84610367565b6001600160a01b0316145b949350505050565b826001600160a01b0316610a3282610658565b6001600160a01b031614610a585760405162461bcd60e51b81526004016104039061167a565b6001600160a01b038216610aba5760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b6064820152608401610403565b610ac78383836001610d62565b826001600160a01b0316610ada82610658565b6001600160a01b031614610b005760405162461bcd60e51b81526004016104039061167a565b600081815260046020908152604080832080546001600160a01b03199081169091556001600160a01b0387811680865260038552838620805460001901905590871680865283862080546001019055868652600290945282852080549092168417909155905184937fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b816001600160a01b0316836001600160a01b03161415610bf25760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c6572000000000000006044820152606401610403565b6001600160a01b03838116600081815260056020908152604080832094871680845294825291829020805460ff191686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b610c6a848484610a1f565b610c7684848484610dea565b61078e5760405162461bcd60e51b8152600401610403906116bf565b60606000610c9f83610ef7565b600101905060008167ffffffffffffffff811115610cbf57610cbf611435565b6040519080825280601f01601f191660200182016040528015610ce9576020820181803683370190505b5090508181016020015b600019016f181899199a1a9b1b9c1cb0b131b232b360811b600a86061a8153600a8504945084610d2257610d27565b610cf3565b509392505050565b610d398383610fcf565b610d466000848484610dea565b6104a45760405162461bcd60e51b8152600401610403906116bf565b600181111561078e576001600160a01b03841615610da8576001600160a01b03841660009081526003602052604081208054839290610da2908490611727565b90915550505b6001600160a01b0383161561078e576001600160a01b03831660009081526003602052604081208054839290610ddf90849061173e565b909155505050505050565b60006001600160a01b0384163b15610eec57604051630a85bd0160e11b81526001600160a01b0385169063150b7a0290610e2e903390899088908890600401611756565b602060405180830381600087803b158015610e4857600080fd5b505af1925050508015610e78575060408051601f3d908101601f19168201909252610e7591810190611793565b60015b610ed2573d808015610ea6576040519150601f19603f3d011682016040523d82523d6000602084013e610eab565b606091505b508051610eca5760405162461bcd60e51b8152600401610403906116bf565b805181602001fd5b6001600160e01b031916630a85bd0160e11b149050610a17565b506001949350505050565b60008072184f03e93ff9f4daa797ed6e38ed64bf6a1f0160401b8310610f365772184f03e93ff9f4daa797ed6e38ed64bf6a1f0160401b830492506040015b6d04ee2d6d415b85acef81000000008310610f62576d04ee2d6d415b85acef8100000000830492506020015b662386f26fc100008310610f8057662386f26fc10000830492506010015b6305f5e1008310610f98576305f5e100830492506008015b6127108310610fac57612710830492506004015b60648310610fbe576064830492506002015b600a83106102cf5760010192915050565b6001600160a01b0382166110255760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f20616464726573736044820152606401610403565b6000818152600260205260409020546001600160a01b03161561108a5760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e746564000000006044820152606401610403565b611098600083836001610d62565b6000818152600260205260409020546001600160a01b0316156110fd5760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e746564000000006044820152606401610403565b6001600160a01b038216600081815260036020908152604080832080546001019055848352600290915280822080546001600160a01b0319168417905551839291907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b82805461117490611586565b90600052602060002090601f01602090048101928261119657600085556111dc565b82601f106111af57805160ff19168380011785556111dc565b828001600101855582156111dc579182015b828111156111dc5782518255916020019190600101906111c1565b506111e89291506111ec565b5090565b5b808211156111e857600081556001016111ed565b6001600160e01b03198116811461091557600080fd5b60006020828403121561122957600080fd5b813561080181611201565b60005b8381101561124f578181015183820152602001611237565b8381111561078e5750506000910152565b60008151808452611278816020860160208601611234565b601f01601f19169290920160200192915050565b6020815260006108016020830184611260565b6000602082840312156112b157600080fd5b5035919050565b80356001600160a01b03811681146112cf57600080fd5b919050565b600080604083850312156112e757600080fd5b6112f0836112b8565b946020939093013593505050565b60008060008060006080868803121561131657600080fd5b853567ffffffffffffffff8082111561132e57600080fd5b818801915088601f83011261134257600080fd5b81358181111561135157600080fd5b89602082850101111561136357600080fd5b60209283019750955050860135925061137e604087016112b8565b9150606086013560ff8116811461139457600080fd5b809150509295509295909350565b6000806000606084860312156113b757600080fd5b6113c0846112b8565b92506113ce602085016112b8565b9150604084013590509250925092565b6000602082840312156113f057600080fd5b610801826112b8565b6000806040838503121561140c57600080fd5b611415836112b8565b91506020830135801515811461142a57600080fd5b809150509250929050565b634e487b7160e01b600052604160045260246000fd5b6000806000806080858703121561146157600080fd5b61146a856112b8565b9350611478602086016112b8565b925060408501359150606085013567ffffffffffffffff8082111561149c57600080fd5b818701915087601f8301126114b057600080fd5b8135818111156114c2576114c2611435565b604051601f8201601f19908116603f011681019083821181831017156114ea576114ea611435565b816040528281528a602084870101111561150357600080fd5b82602086016020830137600060208483010152809550505050505092959194509250565b6000806040838503121561153a57600080fd5b611543836112b8565b9150611551602084016112b8565b90509250929050565b60608152600061156d6060830186611260565b905083602083015260ff83166040830152949350505050565b600181811c9082168061159a57607f821691505b602082108114156115bb57634e487b7160e01b600052602260045260246000fd5b50919050565b8385823760609290921b6bffffffffffffffffffffffff19169190920190815260f89190911b6001600160f81b0319166014820152601501919050565b6020808252602d908201527f4552433732313a2063616c6c6572206973206e6f7420746f6b656e206f776e6560408201526c1c881bdc88185c1c1c9bdd9959609a1b606082015260800190565b6000835161165d818460208801611234565b835190830190611671818360208801611234565b01949350505050565b60208082526025908201527f4552433732313a207472616e736665722066726f6d20696e636f72726563742060408201526437bbb732b960d91b606082015260800190565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b634e487b7160e01b600052601160045260246000fd5b60008282101561173957611739611711565b500390565b6000821982111561175157611751611711565b500190565b6001600160a01b038581168252841660208201526040810183905260806060820181905260009061178990830184611260565b9695505050505050565b6000602082840312156117a557600080fd5b81516108018161120156fea2646970667358221220ffeda3993245185e27cb3cc053706449377dc1248de16d47f10d8e4993682f8a64736f6c63430008090033";

type AwardsConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: AwardsConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Awards__factory extends ContractFactory {
  constructor(...args: AwardsConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _competition: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<Awards> {
    return super.deploy(_competition, overrides || {}) as Promise<Awards>;
  }
  override getDeployTransaction(
    _competition: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_competition, overrides || {});
  }
  override attach(address: string): Awards {
    return super.attach(address) as Awards;
  }
  override connect(signer: Signer): Awards__factory {
    return super.connect(signer) as Awards__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): AwardsInterface {
    return new utils.Interface(_abi) as AwardsInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Awards {
    return new Contract(address, _abi, signerOrProvider) as Awards;
  }
}