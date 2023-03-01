/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type { VoteToken, VoteTokenInterface } from "../../contracts/VoteToken";

const _abi = [
  {
    inputs: [],
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
        name: "delegator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "fromDelegate",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "toDelegate",
        type: "address",
      },
    ],
    name: "DelegateChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "delegate",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "previousBalance",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newBalance",
        type: "uint256",
      },
    ],
    name: "DelegateVotesChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
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
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
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
        internalType: "address",
        name: "delegatee",
        type: "address",
      },
    ],
    name: "delegate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "delegatee",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "nonce",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "expiry",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32",
      },
    ],
    name: "delegateBySig",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "delegates",
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
        internalType: "uint256",
        name: "blockNumber",
        type: "uint256",
      },
    ],
    name: "getPastTotalSupply",
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
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "blockNumber",
        type: "uint256",
      },
    ],
    name: "getPastVotes",
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
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "getVotes",
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
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "nonces",
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
    inputs: [],
    name: "owner",
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
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "safeMint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "to",
        type: "address[]",
      },
    ],
    name: "safeMintBatch",
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
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x6101406040523480156200001257600080fd5b50604051806040016040528060098152602001682b37ba32aa37b5b2b760b91b815250604051806040016040528060018152602001603160f81b815250604051806040016040528060098152602001682b37ba32aa37b5b2b760b91b81525060405180604001604052806002815260200161159560f21b8152508160009080519060200190620000a4929190620001c2565b508051620000ba906001906020840190620001c2565b505050620000d7620000d16200016c60201b60201c565b62000170565b815160209283012081519183019190912060e08290526101008190524660a0818152604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f818801819052818301969096526060810194909452608080850193909352308483018190528151808603909301835260c09485019091528151919095012090529190915261012052620002a5565b3390565b600680546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b828054620001d09062000268565b90600052602060002090601f016020900481019282620001f457600085556200023f565b82601f106200020f57805160ff19168380011785556200023f565b828001600101855582156200023f579182015b828111156200023f57825182559160200191906001019062000222565b506200024d92915062000251565b5090565b5b808211156200024d576000815560010162000252565b600181811c908216806200027d57607f821691505b602082108114156200029f57634e487b7160e01b600052602260045260246000fd5b50919050565b60805160a05160c05160e051610100516101205161276c620002f56000396000610f1201526000610f6101526000610f3c01526000610e9501526000610ebf01526000610ee9015261276c6000f3fe608060405234801561001057600080fd5b506004361061018e5760003560e01c806370a08231116100de5780639ab24eb011610097578063c3cda52011610071578063c3cda5201461036a578063c87b56dd1461037d578063e985e9c514610390578063f2fde38b146103cc57600080fd5b80639ab24eb014610331578063a22cb46514610344578063b88d4fde1461035757600080fd5b806370a08231146102d7578063715018a6146102ea5780637ecebe00146102f25780638da5cb5b146103055780638e539e8c1461031657806395d89b411461032957600080fd5b80633644e5151161014b57806342842e0e1161012557806342842e0e14610272578063587cde1e146102855780635c19a95c146102b15780636352211e146102c457600080fd5b80633644e515146102365780633a46b1a81461024c57806340d097c31461025f57600080fd5b806301ffc9a71461019357806306fdde03146101bb578063081812fc146101d0578063095ea7b3146101fb57806323b872dd146102105780632655227814610223575b600080fd5b6101a66101a136600461215c565b6103df565b60405190151581526020015b60405180910390f35b6101c3610431565b6040516101b291906121d1565b6101e36101de3660046121e4565b6104c3565b6040516001600160a01b0390911681526020016101b2565b61020e610209366004612219565b6104ea565b005b61020e61021e366004612243565b610605565b61020e61023136600461227f565b610636565b61023e6106cb565b6040519081526020016101b2565b61023e61025a366004612219565b6106da565b61020e61026d3660046122f4565b610703565b61020e610280366004612243565b610734565b6101e36102933660046122f4565b6001600160a01b039081166000908152600760205260409020541690565b61020e6102bf3660046122f4565b61074f565b6101e36102d23660046121e4565b61075a565b61023e6102e53660046122f4565b6107ba565b61020e610840565b61023e6103003660046122f4565b610854565b6006546001600160a01b03166101e3565b61023e6103243660046121e4565b610872565b6101c36108ce565b61023e61033f3660046122f4565b6108dd565b61020e61035236600461230f565b61090d565b61020e610365366004612361565b610918565b61020e61037836600461243d565b610950565b6101c361038b3660046121e4565b610a7d565b6101a661039e36600461249d565b6001600160a01b03918216600090815260056020908152604080832093909416825291909152205460ff1690565b61020e6103da3660046122f4565b610af0565b60006001600160e01b031982166380ac58cd60e01b148061041057506001600160e01b03198216635b5e139f60e01b145b8061042b57506301ffc9a760e01b6001600160e01b03198316145b92915050565b606060008054610440906124d0565b80601f016020809104026020016040519081016040528092919081815260200182805461046c906124d0565b80156104b95780601f1061048e576101008083540402835291602001916104b9565b820191906000526020600020905b81548152906001019060200180831161049c57829003601f168201915b5050505050905090565b60006104ce82610b69565b506000908152600460205260409020546001600160a01b031690565b60006104f58261075a565b9050806001600160a01b0316836001600160a01b031614156105685760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b60648201526084015b60405180910390fd5b336001600160a01b03821614806105845750610584813361039e565b6105f65760405162461bcd60e51b815260206004820152603d60248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f7420746f60448201527f6b656e206f776e6572206f7220617070726f76656420666f7220616c6c000000606482015260840161055f565b6106008383610bc8565b505050565b61060f3382610c36565b61062b5760405162461bcd60e51b815260040161055f90612505565b610600838383610cb5565b61063e610e2e565b60288111156106845760405162461bcd60e51b8152602060048201526012602482015271546f6f206d616e792061646472657373657360701b604482015260640161055f565b60005b81811015610600576106b98383838181106106a4576106a4612552565b905060200201602081019061026d91906122f4565b806106c38161257e565b915050610687565b60006106d5610e88565b905090565b6001600160a01b03821660009081526008602052604081206106fc9083610faf565b9392505050565b61070b610e2e565b6000610716600b5490565b9050610726600b80546001019055565b61073082826110cb565b5050565b61060083838360405180602001604052806000815250610918565b3361073081836110e5565b6000818152600260205260408120546001600160a01b03168061042b5760405162461bcd60e51b8152602060048201526018602482015277115490cdcc8c4e881a5b9d985b1a59081d1bdad95b88125160421b604482015260640161055f565b60006001600160a01b0382166108245760405162461bcd60e51b815260206004820152602960248201527f4552433732313a2061646472657373207a65726f206973206e6f7420612076616044820152683634b21037bbb732b960b91b606482015260840161055f565b506001600160a01b031660009081526003602052604090205490565b610848610e2e565b6108526000611157565b565b6001600160a01b0381166000908152600a602052604081205461042b565b60004382106108c35760405162461bcd60e51b815260206004820152601a60248201527f566f7465733a20626c6f636b206e6f7420796574206d696e6564000000000000604482015260640161055f565b61042b600983610faf565b606060018054610440906124d0565b6001600160a01b03811660009081526008602052604081206108fe906111a9565b6001600160e01b031692915050565b6107303383836111e3565b6109223383610c36565b61093e5760405162461bcd60e51b815260040161055f90612505565b61094a848484846112b2565b50505050565b834211156109a05760405162461bcd60e51b815260206004820152601860248201527f566f7465733a207369676e617475726520657870697265640000000000000000604482015260640161055f565b604080517fe48329057bfd03d55e49b547132e39cffd9c1820ad7b9d4c5307691425d15adf60208201526001600160a01b038816918101919091526060810186905260808101859052600090610a1a90610a129060a001604051602081830303815290604052805190602001206112e5565b858585611333565b9050610a258161135b565b8614610a6a5760405162461bcd60e51b8152602060048201526014602482015273566f7465733a20696e76616c6964206e6f6e636560601b604482015260640161055f565b610a7481886110e5565b50505050505050565b6060610a8882610b69565b6000610a9f60408051602081019091526000815290565b90506000815111610abf57604051806020016040528060008152506106fc565b80610ac984611383565b604051602001610ada929190612599565b6040516020818303038152906040529392505050565b610af8610e2e565b6001600160a01b038116610b5d5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b606482015260840161055f565b610b6681611157565b50565b6000818152600260205260409020546001600160a01b0316610b665760405162461bcd60e51b8152602060048201526018602482015277115490cdcc8c4e881a5b9d985b1a59081d1bdad95b88125160421b604482015260640161055f565b600081815260046020526040902080546001600160a01b0319166001600160a01b0384169081179091558190610bfd8261075a565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b600080610c428361075a565b9050806001600160a01b0316846001600160a01b03161480610c8957506001600160a01b0380821660009081526005602090815260408083209388168352929052205460ff165b80610cad5750836001600160a01b0316610ca2846104c3565b6001600160a01b0316145b949350505050565b826001600160a01b0316610cc88261075a565b6001600160a01b031614610cee5760405162461bcd60e51b815260040161055f906125c8565b6001600160a01b038216610d505760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b606482015260840161055f565b610d5d8383836001611420565b826001600160a01b0316610d708261075a565b6001600160a01b031614610d965760405162461bcd60e51b815260040161055f906125c8565b600081815260046020908152604080832080546001600160a01b03199081169091556001600160a01b0387811680865260038552838620805460001901905590871680865283862080546001019055868652600290945282852080549092168417909155905184937fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a461060083838360016114a8565b6006546001600160a01b031633146108525760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015260640161055f565b6000306001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016148015610ee157507f000000000000000000000000000000000000000000000000000000000000000046145b15610f0b57507f000000000000000000000000000000000000000000000000000000000000000090565b50604080517f00000000000000000000000000000000000000000000000000000000000000006020808301919091527f0000000000000000000000000000000000000000000000000000000000000000828401527f000000000000000000000000000000000000000000000000000000000000000060608301524660808301523060a0808401919091528351808403909101815260c0909201909252805191012090565b60004382106110005760405162461bcd60e51b815260206004820181905260248201527f436865636b706f696e74733a20626c6f636b206e6f7420796574206d696e6564604482015260640161055f565b600061100b836114b4565b845490915060008160058111156110695760006110278461151d565b611031908561260d565b60008981526020902090915081015463ffffffff908116908616101561105957809150611067565b611064816001612624565b92505b505b600061107788868585611602565b905080156110b35761109c8861108e60018461260d565b600091825260209091200190565b5464010000000090046001600160e01b03166110b6565b60005b6001600160e01b031698975050505050505050565b610730828260405180602001604052806000815250611658565b6001600160a01b0382811660008181526007602052604080822080548686166001600160a01b0319821681179092559151919094169392849290917f3134e8a2e6d97e929a7e54011ea5485d7d196dd5f0ba4d4ef95803e8e3fc257f9190a461060081836111528661168b565b611696565b600680546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b805460009080156111da576111c38361108e60018461260d565b5464010000000090046001600160e01b03166106fc565b60009392505050565b816001600160a01b0316836001600160a01b031614156112455760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c657200000000000000604482015260640161055f565b6001600160a01b03838116600081815260056020908152604080832094871680845294825291829020805460ff191686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b6112bd848484610cb5565b6112c9848484846117d3565b61094a5760405162461bcd60e51b815260040161055f9061263c565b600061042b6112f2610e88565b8360405161190160f01b6020820152602281018390526042810182905260009060620160405160208183030381529060405280519060200120905092915050565b6000806000611344878787876118dd565b91509150611351816119a1565b5095945050505050565b6001600160a01b0381166000908152600a602052604090208054600181018255905b50919050565b6060600061139083611aef565b600101905060008167ffffffffffffffff8111156113b0576113b061234b565b6040519080825280601f01601f1916602001820160405280156113da576020820181803683370190505b5090508181016020015b600019016f181899199a1a9b1b9c1cb0b131b232b360811b600a86061a8153600a850494508461141357611418565b6113e4565b509392505050565b600181111561094a576001600160a01b03841615611466576001600160a01b0384166000908152600360205260408120805483929061146090849061260d565b90915550505b6001600160a01b0383161561094a576001600160a01b0383166000908152600360205260408120805483929061149d908490612624565b909155505050505050565b61094a84848484611bc7565b600063ffffffff8211156115195760405162461bcd60e51b815260206004820152602660248201527f53616665436173743a2076616c756520646f65736e27742066697420696e203360448201526532206269747360d01b606482015260840161055f565b5090565b60008161152c57506000919050565b6000600161153984611bd7565b901c6001901b905060018184816115525761155261268e565b048201901c9050600181848161156a5761156a61268e565b048201901c905060018184816115825761158261268e565b048201901c9050600181848161159a5761159a61268e565b048201901c905060018184816115b2576115b261268e565b048201901c905060018184816115ca576115ca61268e565b048201901c905060018184816115e2576115e261268e565b048201901c90506106fc818285816115fc576115fc61268e565b04611c6b565b60005b818310156114185760006116198484611c81565b60008781526020902090915063ffffffff86169082015463ffffffff16111561164457809250611652565b61164f816001612624565b93505b50611605565b6116628383611c9c565b61166f60008484846117d3565b6106005760405162461bcd60e51b815260040161055f9061263c565b600061042b826107ba565b816001600160a01b0316836001600160a01b0316141580156116b85750600081115b15610600576001600160a01b03831615611746576001600160a01b038316600090815260086020526040812081906116f390611e3f85611e4b565b91509150846001600160a01b03167fdec2bacdd2f05b59de34da9b523dff8be42e5e38e818c82fdb0bae774387a724838360405161173b929190918252602082015260400190565b60405180910390a250505b6001600160a01b03821615610600576001600160a01b0382166000908152600860205260408120819061177c90611e8385611e4b565b91509150836001600160a01b03167fdec2bacdd2f05b59de34da9b523dff8be42e5e38e818c82fdb0bae774387a72483836040516117c4929190918252602082015260400190565b60405180910390a25050505050565b60006001600160a01b0384163b156118d557604051630a85bd0160e11b81526001600160a01b0385169063150b7a02906118179033908990889088906004016126a4565b602060405180830381600087803b15801561183157600080fd5b505af1925050508015611861575060408051601f3d908101601f1916820190925261185e918101906126e1565b60015b6118bb573d80801561188f576040519150601f19603f3d011682016040523d82523d6000602084013e611894565b606091505b5080516118b35760405162461bcd60e51b815260040161055f9061263c565b805181602001fd5b6001600160e01b031916630a85bd0160e11b149050610cad565b506001610cad565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08311156119145750600090506003611998565b6040805160008082526020820180845289905260ff881692820192909252606081018690526080810185905260019060a0016020604051602081039080840390855afa158015611968573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b03811661199157600060019250925050611998565b9150600090505b94509492505050565b60008160048111156119b5576119b56126fe565b14156119be5750565b60018160048111156119d2576119d26126fe565b1415611a205760405162461bcd60e51b815260206004820152601860248201527f45434453413a20696e76616c6964207369676e61747572650000000000000000604482015260640161055f565b6002816004811115611a3457611a346126fe565b1415611a825760405162461bcd60e51b815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e67746800604482015260640161055f565b6003816004811115611a9657611a966126fe565b1415610b665760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c604482015261756560f01b606482015260840161055f565b60008072184f03e93ff9f4daa797ed6e38ed64bf6a1f0160401b8310611b2e5772184f03e93ff9f4daa797ed6e38ed64bf6a1f0160401b830492506040015b6d04ee2d6d415b85acef81000000008310611b5a576d04ee2d6d415b85acef8100000000830492506020015b662386f26fc100008310611b7857662386f26fc10000830492506010015b6305f5e1008310611b90576305f5e100830492506008015b6127108310611ba457612710830492506004015b60648310611bb6576064830492506002015b600a831061042b5760010192915050565b611bd2848483611e8f565b61094a565b600080608083901c15611bec57608092831c92015b604083901c15611bfe57604092831c92015b602083901c15611c1057602092831c92015b601083901c15611c2257601092831c92015b600883901c15611c3457600892831c92015b600483901c15611c4657600492831c92015b600283901c15611c5857600292831c92015b600183901c1561042b5760010192915050565b6000818310611c7a57816106fc565b5090919050565b6000611c906002848418612714565b6106fc90848416612624565b6001600160a01b038216611cf25760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f2061646472657373604482015260640161055f565b6000818152600260205260409020546001600160a01b031615611d575760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e74656400000000604482015260640161055f565b611d65600083836001611420565b6000818152600260205260409020546001600160a01b031615611dca5760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e74656400000000604482015260640161055f565b6001600160a01b038216600081815260036020908152604080832080546001019055848352600290915280822080546001600160a01b0319168417905551839291907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a46107306000838360016114a8565b60006106fc828461260d565b600080611e7685611e71611e5e886111a9565b6001600160e01b0316868863ffffffff16565b611eff565b915091505b935093915050565b60006106fc8284612624565b6001600160a01b038316611eae57611eab6009611e8383611e4b565b50505b6001600160a01b038216611ecd57611eca6009611e3f83611e4b565b50505b6001600160a01b0383811660009081526007602052604080822054858416835291205461060092918216911683611696565b600080611f1d84611f0f436114b4565b611f1886611f33565b611f9c565b6001600160e01b03918216969116945092505050565b60006001600160e01b038211156115195760405162461bcd60e51b815260206004820152602760248201527f53616665436173743a2076616c756520646f65736e27742066697420696e20326044820152663234206269747360c81b606482015260840161055f565b8254600090819080156120ec576000611fba8761108e60018561260d565b60408051808201909152905463ffffffff8082168084526401000000009092046001600160e01b03166020840152919250908716101561203c5760405162461bcd60e51b815260206004820152601760248201527f436865636b706f696e743a20696e76616c6964206b6579000000000000000000604482015260640161055f565b8563ffffffff16816000015163ffffffff16141561208c57846120648861108e60018661260d565b80546001600160e01b03929092166401000000000263ffffffff9092169190911790556120dc565b6040805180820190915263ffffffff80881682526001600160e01b0380881660208085019182528b54600181018d5560008d81529190912094519151909216640100000000029216919091179101555b602001519250839150611e7b9050565b50506040805180820190915263ffffffff80851682526001600160e01b0380851660208085019182528854600181018a5560008a815291822095519251909316640100000000029190931617920191909155905081611e7b565b6001600160e01b031981168114610b6657600080fd5b60006020828403121561216e57600080fd5b81356106fc81612146565b60005b8381101561219457818101518382015260200161217c565b8381111561094a5750506000910152565b600081518084526121bd816020860160208601612179565b601f01601f19169290920160200192915050565b6020815260006106fc60208301846121a5565b6000602082840312156121f657600080fd5b5035919050565b80356001600160a01b038116811461221457600080fd5b919050565b6000806040838503121561222c57600080fd5b612235836121fd565b946020939093013593505050565b60008060006060848603121561225857600080fd5b612261846121fd565b925061226f602085016121fd565b9150604084013590509250925092565b6000806020838503121561229257600080fd5b823567ffffffffffffffff808211156122aa57600080fd5b818501915085601f8301126122be57600080fd5b8135818111156122cd57600080fd5b8660208260051b85010111156122e257600080fd5b60209290920196919550909350505050565b60006020828403121561230657600080fd5b6106fc826121fd565b6000806040838503121561232257600080fd5b61232b836121fd565b91506020830135801515811461234057600080fd5b809150509250929050565b634e487b7160e01b600052604160045260246000fd5b6000806000806080858703121561237757600080fd5b612380856121fd565b935061238e602086016121fd565b925060408501359150606085013567ffffffffffffffff808211156123b257600080fd5b818701915087601f8301126123c657600080fd5b8135818111156123d8576123d861234b565b604051601f8201601f19908116603f011681019083821181831017156124005761240061234b565b816040528281528a602084870101111561241957600080fd5b82602086016020830137600060208483010152809550505050505092959194509250565b60008060008060008060c0878903121561245657600080fd5b61245f876121fd565b95506020870135945060408701359350606087013560ff8116811461248357600080fd5b9598949750929560808101359460a0909101359350915050565b600080604083850312156124b057600080fd5b6124b9836121fd565b91506124c7602084016121fd565b90509250929050565b600181811c908216806124e457607f821691505b6020821081141561137d57634e487b7160e01b600052602260045260246000fd5b6020808252602d908201527f4552433732313a2063616c6c6572206973206e6f7420746f6b656e206f776e6560408201526c1c881bdc88185c1c1c9bdd9959609a1b606082015260800190565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b600060001982141561259257612592612568565b5060010190565b600083516125ab818460208801612179565b8351908301906125bf818360208801612179565b01949350505050565b60208082526025908201527f4552433732313a207472616e736665722066726f6d20696e636f72726563742060408201526437bbb732b960d91b606082015260800190565b60008282101561261f5761261f612568565b500390565b6000821982111561263757612637612568565b500190565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b634e487b7160e01b600052601260045260246000fd5b6001600160a01b03858116825284166020820152604081018390526080606082018190526000906126d7908301846121a5565b9695505050505050565b6000602082840312156126f357600080fd5b81516106fc81612146565b634e487b7160e01b600052602160045260246000fd5b60008261273157634e487b7160e01b600052601260045260246000fd5b50049056fea26469706673582212205dbe1d197c6f850dee1dd1b5a8493de43158f5168401299a9e4b7d4c1652050564736f6c63430008090033";

type VoteTokenConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: VoteTokenConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class VoteToken__factory extends ContractFactory {
  constructor(...args: VoteTokenConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<VoteToken> {
    return super.deploy(overrides || {}) as Promise<VoteToken>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): VoteToken {
    return super.attach(address) as VoteToken;
  }
  override connect(signer: Signer): VoteToken__factory {
    return super.connect(signer) as VoteToken__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): VoteTokenInterface {
    return new utils.Interface(_abi) as VoteTokenInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): VoteToken {
    return new Contract(address, _abi, signerOrProvider) as VoteToken;
  }
}
