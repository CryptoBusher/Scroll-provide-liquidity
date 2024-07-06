import 'dotenv/config';


export const config = {
    rpcs: {
        scroll: process.env.SCROLL_RPC                          // Нода, подтягивается из .env файла
    },

    generalProxy: {
        address: process.env.GENERAL_PROXY_ADDRESS,             // Прокси, подтягивается из .env файла
        link: process.env.GENERAL_PROXY_LINK,                   // Ссылка на смену IP, подтягивается из .env файла
        sleepTimeSec: 15                                        // Время ожидания после запроса на смену IP (ответ может быть положительным сразу, но прокси еще не будет готов)
    },

	telegramData: {	
		botToken: process.env.TG_BOT_TOKEN,                     // Токен Telegram бота, подтягивается из .env файла
		chatId: process.env.TG_CHAT_ID                          // ID чата для уведомлений (chatId или supergroupId/chatId), подтягивается из .env файла
	},

    accDelaySec: [300, 900],                                    // Задержка между аккаунтами в секундах (min, max)
    gasMultipliers: [1.3, 1.6],                                 // Увеличиваем gasLimit + gasPrice (min, max). AAVE депозит работает с дефолтным gasLimit (захардкодил)

    tokensConfig: {
        ETH: {
            depositEnabled: true,                               // Депозитить ETH (true, false)
            minDeposit: 0.013,                                  // Минимальный депозит (>0)
            remainingBalance: [0.001, 0.002],                   // Сколько должно оставаться на кошельке после депозита (min, max). Депозит будет сделан, если баланс >= (minDeposit + remainingBalance max) 
            roundToDecimals: [2, 4],                            // Округление суммы депозита (min, max). Например, при значении 2: 0.123456789 -> 0.123, 0.0123456789 -> 0.0123
            safetyTreshold: 0.5                                 // Запас при проверке доступности пула (в пуле должно будет хватать места на amountToDeposi + safetyTreshold). Чем выше значение - тем меньше вероятность не успеть (0+)
        },
        USDC: {
            depositEnabled: false,                              // Депозитить USDC (true, false)
            minDeposit: 0.1,                                    // Минимальный депозит (>0)
            remainingBalance: [0, 0],                           // Сколько должно оставаться на кошельке после депозита (min, max)
            roundToDecimals: [1, 2],                            // Округление суммы депозита (min, max)
            safetyTreshold: 1000                                // Запас при проверке доступности пула (0+)
        }
    },

    protocolsPriority: {                                        // Вероятности использования протоколов (будет актуально, если добавлю еще модули)
        Aave: 1
    },

    supplyValidationDelaySec: [10, 20]                          // Пауза в сеундах перед очередной проверкой доступности пула (min, max)
};
