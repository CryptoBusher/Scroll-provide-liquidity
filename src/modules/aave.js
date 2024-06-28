// https://app.aave.com/?marketName=proto_scroll_v3
// https://docs.aave.com/developers/deployed-contracts/v3-mainnet/scroll

import fs from 'fs';
import { ethers, MaxUint256 } from "ethers";
import { toWei, fromWei, getBalance, approve, getApprovedAmount } from "./../utils/web3Custom.js";
import { tokensData } from "./../utils/constants.js";
import { randFloat, randInt, roundToAppropriateDecimalPlace } from "./../utils/helpers.js";
import { logger } from "./../logger/logger.js";


export class Aave {
	static ROUTER_ADDRESS = "0xFF75A4B698E3Ec95E608ac0f22A03B8368E05F5D";
	static ROUTER_ABI = JSON.parse(fs.readFileSync('./src/abi/aaveRouter.json', "utf8"));
	
	static POOL_V3_ADDRESS = "0x11fCfe756c05AD438e312a7fd934381537D3cFfe";
	static POOL_V3_ABI = JSON.parse(fs.readFileSync('./src/abi/aavePoolV3.json', "utf8"));
	
	static POOL_DATA_PROVIDER_ADDRESS = "0xa99F4E69acF23C6838DE90dD1B5c02EA928A53ee";
	static POOL_DATA_PROVIDER_ABI = JSON.parse(fs.readFileSync('./src/abi/aavePoolDataProvider.json', "utf8"));
	
	static AAVE_SCROLL_WETH_ADDRESS = "0xf301805be1df81102c957f6d4ce29d2b8c056b2a";
	static AAVE_SCROLL_USDC_ADDRESS = "0x1D738a3436A8C49CefFbaB7fbF04B660fb528CbD";

	constructor(scrollProvider, scrollSigner, gasLimitMultipliers) {
		this.protocolName = 'Aave';

		this.scrollProvider = scrollProvider;
		this.scrollSigner = scrollSigner;
		this.gasLimitMultipliers = gasLimitMultipliers;

		this.routerContract = new ethers.Contract(Aave.ROUTER_ADDRESS, Aave.ROUTER_ABI, this.scrollSigner);
		this.poolV3Contract = new ethers.Contract(Aave.POOL_V3_ADDRESS, Aave.POOL_V3_ABI, this.scrollSigner);
		this.poolDataProviderContract = new ethers.Contract(Aave.POOL_DATA_PROVIDER_ADDRESS, Aave.POOL_DATA_PROVIDER_ABI, this.scrollProvider);
	}

	getGasLimitMultiplier() {
		return randFloat(this.gasLimitMultipliers[0], this.gasLimitMultipliers[1]);
	}

	async deposit(tokenName, amountWei) {
		if (tokenName === 'ETH') {
			return await this.depositEth(amountWei);
		} else {
			return await this.depositToken(tokenName, amountWei);
		}
	}

	async depositEth(amountWei) {
		logger.debug('Depositing ETH to AAVE');
		const gasLimit = 300000; // idk why but it is static in metamask
		await this.checkPoolAvailability('ETH');
		
		logger.debug(`Depositing`);
		const tx = await this.routerContract.depositETH(
			Aave.POOL_V3_ADDRESS,
			this.scrollSigner.address,
			0,
			{ value: amountWei, gasLimit }
		);

		const receipt = await tx.wait();
		const txData = await tx.data;

		return await receipt.hash;
	}

	async depositToken(tokenName, amountWei) {
		logger.debug(`Depositing ${amountWei} of ${tokenName} to AAVE`);
		const gasLimit = 300000; // idk why but it is static in metamask
		await this.checkPoolAvailability(tokenName);

		const approvedAmountWei = await getApprovedAmount(
			tokensData.scroll[tokenName].address,
			this.scrollSigner.address,
			Aave.POOL_V3_ADDRESS,
			this.scrollProvider
		);

		logger.debug(`approvedAmountWei: ${approvedAmountWei}`);
		if (await approvedAmountWei < amountWei) {
			logger.debug(`Going to approve first`);
			const approveHash = await approve(
				tokensData.scroll[tokenName].address,
				amountWei,
				Aave.POOL_V3_ADDRESS,
				this.scrollSigner,
				this.getGasLimitMultiplier()
			);
			logger.debug(`approveHash: ${approveHash}`);
			const delaySec = randInt(3, 10);
			logger.debug(`Sleeping ${delaySec} seconds`);
			await sleep(delaySec);
		}

		logger.debug(`Depositing`);
		const tx = await this.poolV3Contract.supply(
			tokensData.scroll[tokenName].address,
			amountWei,
			this.scrollSigner.address,
			0,
			{ gasLimit }
		);

		const receipt = await tx.wait();
		const txData = await tx.data;

		return await receipt.hash;
	}

	async checkPoolAvailability(tokenName) {
		// const isEthPoolPaused = await this.protocolDataProviderContract.getPaused(Aave.AAVE_SCROLL_WETH_ADDRESS);
		// return isEthPoolPaused;

		// TODO: throw error if pool is paused
	}
}
