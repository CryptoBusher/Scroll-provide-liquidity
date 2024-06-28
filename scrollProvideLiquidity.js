import { ethers, JsonRpcProvider, formatEther, parseEther, FetchRequest } from "ethers";
import { HttpsProxyAgent } from "https-proxy-agent";
import fetch from "node-fetch";

import { logger } from './src/logger/logger.js';
import { config } from './config.js';
import { txtToArray, randomChoice, sleep, weightedRandomChoice, randFloat, roundToAppropriateDecimalPlace, randInt, removeLineFromTxt } from './src/utils/helpers.js'
import { TelegramBot } from './src/modules/telegram.js';
import { Aave } from './src/modules/aave.js';
import { LayerBank } from './src/modules/layerBank.js';
import { getBalance, fromWei, toWei } from './src/utils/web3Custom.js';


const tgBot = config.telegramData.botToken ? new TelegramBot(config.telegramData.botToken, config.telegramData.chatId) : undefined;


const getRandomWalletData = () => {
    const walletsData = txtToArray('wallets.txt')
    return randomChoice(walletsData);
};

const removeWalletData = (walletData) => {
    removeLineFromTxt('wallets.txt', walletData);
};

const changeProxyIp = async (link) => {
    for (let i = 0; i < 10; i++) {
        try {
            const response = await fetch(link, {method: 'GET', timeout: 10000});
            if (response.status != 200) {
                throw new Error();
            }

            logger.debug(`IP change response: ${JSON.stringify(await response.json())}`);
            logger.debug(`Changed ip, sleeping ${config.generalProxy.sleepTimeSec} seconds`);
            await sleep(config.generalProxy.sleepTimeSec);
            return;

        } catch (e) {
            logger.debug('Failed to change proxy ip, retrying');
            await sleep(6);
        }
    }

    throw new Error(`Failed to change proxy IP`);
};

const generateProviderAndSigner = (privateKey, proxy=undefined) => {
    let fetchRequest = undefined;
    if (proxy) {
        fetchRequest = new FetchRequest(config.rpcs.scroll);
        fetchRequest.getUrlFunc = FetchRequest.createGetUrlFunc({
			agent: new HttpsProxyAgent(proxy),
		});
    };

    const provider = new JsonRpcProvider(fetchRequest ? fetchRequest : config.rpcs.scroll);
    const signer = new ethers.Wallet(privateKey, provider);

    return [provider, signer];
};

const initLendingProtocol = (provider, signer) => {
    const protocols = {
        'Aave': Aave,
        'LayerBank': LayerBank
    };

    const protocolToUse = weightedRandomChoice(config.protocolsPriority);
    return new protocols[protocolToUse](provider, signer, config.gasLimitMultipliers);
};

const chooseTokenAndAmount = async (walletAddress, provider) => {
    const allTokens = [
        {
            name: 'ETH',
            balanceWei: 0,
            balanceHuman: 0,
            canDeposit: false,
        },
        {
            name: 'USDC',
            balanceWei: 0,
            balanceHuman: 0,
            canDeposit: false,
        }
    ];

    for (const token of allTokens) {
        const balanceWei = await getBalance(walletAddress, provider, token.name);
        const balanceHuman = fromWei(token.name, await balanceWei);
        token.balanceWei = balanceWei;
        token.balanceHuman = balanceHuman;

        if (config.tokensConfig[token.name].depositEnabled && balanceHuman >= config.tokensConfig[token.name].minDeposit + config.tokensConfig[token.name].remainingBalance[1]) {
            token.canDeposit = true;
        }
    }

    const availableTokens = allTokens.filter(token => token.canDeposit);
    logger.debug(`availableTokens: ${availableTokens}`);

    if (availableTokens.length == 0) {
        throw new Error('nothing to deposit');
    }

    const tokenToDepositData = randomChoice(availableTokens);
    const tokenConfig = {...config.tokensConfig[tokenToDepositData.name]};

    const balanceToRemainHuman = randFloat(tokenConfig.remainingBalance[0], tokenConfig.remainingBalance[1]);
    if (balanceToRemainHuman == 0) {
        return [ tokenToDepositData.name, tokenToDepositData.balanceWei ];
    }

    const balanceToDepositSybilHuman = tokenToDepositData.balanceHuman - balanceToRemainHuman;
    const balanceToDepositHuman = roundToAppropriateDecimalPlace(balanceToDepositSybilHuman, tokenConfig.roundToDecimals[0], tokenConfig.roundToDecimals[1]);
    const balanceToDepositWei = toWei(tokenToDepositData.name, balanceToDepositHuman);
    return [ tokenToDepositData.name, balanceToDepositWei ];
};


const startDepositing = async() => {
    while (true) {
        const walletData = getRandomWalletData();
        if (!walletData) {
            logger.info('No any wallets remaining');

            if (tgBot) {
                const tgMessage = `🚀 #completed\n\nNo any wallets remaining`;
                await tgBot.sendNotification(tgMessage);
            }
            return;
        }

        let [ name, privateKey, proxy ] = walletData.split('|');
        
        try {
            logger.info(`${name} - processing wallet`);
    
            if (!proxy && config.generalProxy.address) {
                logger.info(`${name} - using general proxy`);
                proxy = config.generalProxy.address;
    
                logger.info(`${name} - changing proxy ip`);
                await changeProxyIp(config.generalProxy.link);
            }
            
            const [ provider, signer ] = generateProviderAndSigner(privateKey, proxy);
            const protocol = initLendingProtocol(provider, signer);
            const [ tokenName, amountWei ] = await chooseTokenAndAmount(signer.address, provider);
    
            logger.info(`${name} - going to deposit ${fromWei(tokenName, amountWei)} of ${tokenName} to ${protocol.protocolName}`);
            const hash = await protocol.deposit(tokenName, amountWei);
            logger.info(`${name} - success, hash: ${await hash}`);
    
            if (tgBot) {
                const tgMessage = `✅ #success\n\n<b>Wallet: </b>${name}\n<b>Deposited to: </b>${protocol.protocolName}\n<b>Amount: </b>${fromWei(tokenName, amountWei)} ${tokenName}\n\<b>Links: </b> <a href="https://scrollscan.com/address/${signer.address}">Wallet</a> | <a href="https://scrollscan.com/tx/${hash}">Tx</a> | <a href="https://debank.com/profile/${signer.address}/history?chain=scrl">DeBank</a>`;
                await tgBot.sendNotification(tgMessage);
            };
    
        } catch(e) {
            if (e.message === 'nothing to deposit') {
                logger.info(`${name} - ${e.message}`);

                if (tgBot) {
                    const tgMessage = `🎯 #finished\n\n<b>Wallet: </b>${name}\n<b>Info: </b> Nothing to deposit`;
                    await tgBot.sendNotification(tgMessage);
                }

                removeWalletData(walletData);
                continue;
            } else {
                logger.error(`${name} - failed to process wallet, reason: ${e.message}`);

                if (tgBot) {
                    const tgMessage = `⛔️ #fail\n\n<b>Wallet: </b>${name}\n<b>Info: </b> ${e.message}`;
                    await tgBot.sendNotification(tgMessage);
                }
            }
        }

        const delayBeforeNext = randInt(config.accDelaySec[0], config.accDelaySec[1]);
        logger.info(`Sleeping ${(delayBeforeNext / 60).toFixed(2)} minutes before next`);
        await sleep(delayBeforeNext);
    }
};


startDepositing();