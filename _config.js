import 'dotenv/config';


export const config = {
    rpcs: {
        scroll: process.env.SCROLL_RPC
    },

    generalProxy: {
        address: process.env.GENERAL_PROXY_ADDRESS,
        link: process.env.GENERAL_PROXY_LINK,
        sleepTimeSec: 15
    },

	telegramData: {	
		botToken: process.env.TG_BOT_TOKEN,
		chatId: process.env.TG_CHAT_ID
	},

    accDelaySec: [300, 900],
    gasLimitMultipliers: [1.3, 1.6],

    tokensConfig: {
        ETH: {
            depositEnabled: true,
            minDeposit: 0.013,
            remainingBalance: [0.001, 0.002],
            roundToDecimals: [2, 4],
        },
        USDC: {
            depositEnabled: false,
            minDeposit: 0.1,
            remainingBalance: [0, 0],
            roundToDecimals: [1, 2],
        }
    },

    protocolsPriority: {
        Aave: 1
    }
};
