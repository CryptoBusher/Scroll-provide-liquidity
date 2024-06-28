export const tokensData = {
	scroll: {
		USDT: {
			address: "0xf55BEC9cafDbE8730f096Aa55dad6D22d44099Df",
			decimals: 6,
			isStable: true,
			cgData: {
				id: "tether",
				symbol: "usdt",
				name: "Tether"
			},
		},
		USDC: {
			address: "0x06efdbff2a14a7c8e15944d1f4a48f9f95f663a4",
			decimals: 6,
			isStable: true,
			cgData: {
				id: "usd-coin",
				symbol: "usdc",
				name: "USDC"
			}
		},
		DAI: {
			address: "0xca77eb3fefe3725dc33bccb54edefc3d9f764f97",
			decimals: 18,
			isStable: true,
			cgData: {
				id: "dai",
				symbol: "dai",
				name: "Dai"		
			}
		},
		WBTC: {
			address: "0x3c1bca5a656e69edcd0d4e36bebb3fcdaca60cf1",
			decimals: 8,
			isStable: false,
			cgData: {
				id: "bitcoin",
				symbol: "btc",
				name: "Bitcoin"		
			}
		},
		SIS: {
			address: "0x1467b62a6ae5cdcb10a6a8173cfe187dd2c5a136",
			decimals: 18,
			isStable: false,
			cgData: {
				id: "symbiosis-finance",
				symbol: "sis",
				name: "Symbiosis"
			}
		},
		ETH: {
			address: "0x5300000000000000000000000000000000000004",
			decimals: 18,
			isStable: false,
			cgData: {
				"id": "ethereum",
				"symbol": "eth",
				"name": "Ethereum"		
			}
		},
		LETH: {  // LayerBank staked ETH
			address: "0x274C3795dadfEbf562932992bF241ae087e0a98C",
			decimals: 18,
		},
		LUSDC: {  // LayerBank staked USDC
			address: "0x0D8F8e271DD3f2fC58e5716d3Ff7041dBe3F0688",
			decimals: 18,
		},
		AWETH: {  // AAVE staked ETH
			address: "0xf301805be1df81102c957f6d4ce29d2b8c056b2a",
			decimals: 18,
			cgData: {
				"id": "ethereum",
				"symbol": "eth",
				"name": "Ethereum"		
			}
		}
	}
};