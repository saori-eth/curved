const dotenv = require("dotenv");
dotenv.config();
const { ethers } = require("ethers");
import { DB } from "./DB.js";
const CurveABI = require("./abi/Curved.json");
const { MODE, ALCHEMY_WS, LOCAL_WS, LOCAL_CURVED_ADDRESS } = process.env;

const wsUrl = MODE === "dev" ? LOCAL_WS : ALCHEMY_WS;
const curveAddr = MODE === "dev" ? LOCAL_CURVED_ADDRESS : "";
const provider = new ethers.providers.WebSocketProvider(wsUrl);
const curve = new ethers.Contract(curveAddr, CurveABI, provider);
const db = new DB();

curve.on("*", (event) => {
  console.log(event);
});

/*

ShareCreated event:
{
  blockNumber: 317,
  blockHash: '0x2a70e926e07d2409a174fee95df94b702ea2adde32c80d85f075c6daedd290de',
  transactionIndex: 0,
  removed: false,
  address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  data: '0x',
  topics: [
    '0x335b5487495f05d92d4db67accd7283d32ffa24a7eb1d604889b384e48883762',
    '0x000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266',
    '0x0000000000000000000000000000000000000000000000000000000000000000'
  ],
  transactionHash: '0x66f3bd934f06c8e634fa8f4861849850de595555bc89da34d3c7383ea9a4ed02',
  logIndex: 0,
  removeListener: [Function (anonymous)],
  getBlock: [Function (anonymous)],
  getTransaction: [Function (anonymous)],
  getTransactionReceipt: [Function (anonymous)],
  event: 'ShareCreated',
  eventSignature: 'ShareCreated(address,uint256)',
  decode: [Function (anonymous)],
  args: [
    '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    BigNumber { _hex: '0x00', _isBigNumber: true },
    owner: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    id: BigNumber { _hex: '0x00', _isBigNumber: true }
  ]
}


Trade event:
{
  blockNumber: 373,
  blockHash: '0x78b9a5750be43e9903159d1fe118641d84b317cc765988ddf714c83b27797412',
  transactionIndex: 0,
  removed: false,
  address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  data: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb9226600000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000e35fa931a0000000000000000000000000000000000000000000000000000000000000000001',
  topics: [
    '0x09a786993c2becc8264c2a90ccc09ca6a571883f97635cc26ed418876b3bdb0a'
  ],
  transactionHash: '0xfb75618b8ea996c8f2ad27f20325bd7f15f53cb674510c4c9f1612ca54967dda',
  logIndex: 0,
  removeListener: [Function (anonymous)],
  getBlock: [Function (anonymous)],
  getTransaction: [Function (anonymous)],
  getTransactionReceipt: [Function (anonymous)],
  event: 'Trade',
  eventSignature: 'Trade(uint256,uint256,address,address,uint256,uint256,uint256)',
  decode: [Function (anonymous)],
  args: [
    BigNumber { _hex: '0x00', _isBigNumber: true },
    BigNumber { _hex: '0x00', _isBigNumber: true },
    '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    BigNumber { _hex: '0x01', _isBigNumber: true },
    BigNumber { _hex: '0xe35fa931a000', _isBigNumber: true },
    BigNumber { _hex: '0x01', _isBigNumber: true },
    id: BigNumber { _hex: '0x00', _isBigNumber: true },
    side: BigNumber { _hex: '0x00', _isBigNumber: true },
    trader: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    owner: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    amount: BigNumber { _hex: '0x01', _isBigNumber: true },
    price: BigNumber { _hex: '0xe35fa931a000', _isBigNumber: true },
    supply: BigNumber { _hex: '0x01', _isBigNumber: true }
  ]
}
*/
