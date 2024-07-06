import fs from "fs";

import { ethers, parseEther, formatEther, parseUnits, formatUnits } from "ethers";
import { tokensData } from './constants.js';


export const getBalance = async (walletAddress, provider, tokenName) => {
	if (tokenName == 'ETH') {
		return await provider.getBalance(walletAddress);
	} else {
		const erc20Abi = JSON.parse(fs.readFileSync('./src/abi/erc20.json', "utf8"));
		const tokenContract = new ethers.Contract(tokensData.scroll[tokenName].address, erc20Abi, provider);
		return await tokenContract.balanceOf(walletAddress);
	}
};

export const approve = async (tokenAddress, amountWei, spenderAddress, signer, gasMultiplier) => {
	const erc20Abi = JSON.parse(fs.readFileSync('./src/abi/erc20.json', "utf8"));
	const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, signer);

	const estimatedGasLimit = await tokenContract.approve.estimateGas(spenderAddress, amountWei);
	const gasLimit = estimatedGasLimit * BigInt(parseInt(gasMultiplier * 100)) / BigInt(100);

	const feeData = await signer.provider.getFeeData();
	const estimatedGasPrice = feeData.gasPrice;
	const gasPrice = estimatedGasPrice * BigInt(parseInt(gasMultiplier * 100)) / BigInt(100);

	const tx = await tokenContract.approve(spenderAddress, amountWei, { gasLimit, gasPrice }); 
	const receipt = await tx.wait();
	return await receipt.hash;
};

export const getApprovedAmount = async (tokenAddress, ownerAddress, spenderAddress, provider) => {
	const erc20Abi = JSON.parse(fs.readFileSync('./src/abi/erc20.json', "utf8"));
	const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, provider);
	return await tokenContract.allowance(ownerAddress, spenderAddress);
};

export const toWei = (tokenName, amount) => {
	if (tokenName === 'ETH') {
		return parseEther(amount.toString());
	} else {
		return parseUnits(amount.toString(), tokensData.scroll[tokenName].decimals);
	}
};

export const fromWei = (tokenName, amount) => {
	if (tokenName === 'ETH') {
		return parseFloat(formatEther(amount.toString()));
	} else {
		return parseFloat(formatUnits(amount.toString(), tokensData.scroll[tokenName].decimals));
	}
};
