import { ethers, JsonRpcProvider, formatEther, parseEther, FetchRequest } from "ethers";
import { HttpsProxyAgent } from "https-proxy-agent";
import fetch from "node-fetch";
import fs from 'fs';

import { config } from './config.js';
import { logger } from './src/logger/logger.js';


const provider = new JsonRpcProvider(config.rpcs.scroll);

const ROUTER_ADDRESS = "0xFF75A4B698E3Ec95E608ac0f22A03B8368E05F5D";
const ROUTER_ABI = JSON.parse(fs.readFileSync('./src/abi/aaveRouter.json', "utf8"));

const POOL_V3_ADDRESS = "0x11fCfe756c05AD438e312a7fd934381537D3cFfe";
const POOL_V3_ABI = JSON.parse(fs.readFileSync('./src/abi/aavePoolV3.json', "utf8"));

const POOL_DATA_PROVIDER_ADDRESS = "0xa99F4E69acF23C6838DE90dD1B5c02EA928A53ee";
const POOL_DATA_PROVIDER_ABI = JSON.parse(fs.readFileSync('./src/abi/aavePoolDataProvider.json', "utf8"));

const AAVE_SCROLL_WETH_ADDRESS = "0xf301805be1df81102c957f6d4ce29d2b8c056b2a";
const AAVE_SCROLL_USDC_ADDRESS = "0x1D738a3436A8C49CefFbaB7fbF04B660fb528CbD";


const routerContract = new ethers.Contract(ROUTER_ADDRESS, ROUTER_ABI, provider);
const poolV3Contract = new ethers.Contract(POOL_V3_ADDRESS, POOL_V3_ABI, provider);
const poolDataProviderContract = new ethers.Contract(POOL_DATA_PROVIDER_ADDRESS, POOL_DATA_PROVIDER_ABI, provider);


const getPaused = async () => {
    const isPaused = await poolDataProviderContract.getPaused(AAVE_SCROLL_WETH_ADDRESS);
    console.log(isPaused);
};

// getPaused();


// [[0x5300000000000000000000000000000000000004]
// [0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4]
// [0xf610A9dfB7C89644979b4A0f27063E9e7d7Cda32]]


const a = 18000
const b = 17999067577728267548445 / (10**18)
console.log(a-b)
console.log(a)
console.log(b)