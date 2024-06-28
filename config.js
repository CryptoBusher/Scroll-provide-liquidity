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

    accDelaySec: [1800, 5400],
    gasLimitMultipliers: [1.1, 1.4],

    tokensConfig: {
        ETH: {
            depositEnabled: true,
            minDeposit: 0.0005,
            remainingBalance: [0.007, 1],
            roundToDecimals: [3, 5],
        },
        USDC: {
            depositEnabled: false,
            minDeposit: 0.1,
            remainingBalance: [0, 0],
            roundToDecimals: [1, 2],
        }
    },

    protocolsPriority: {
        Aave: 1,
        LayerBank: 0
    }
};
