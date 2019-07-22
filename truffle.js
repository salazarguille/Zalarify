/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a 
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() { 
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>') 
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */
const appConfig = require('./src/config');

const Web3 = require('web3');

const web3 = new Web3();
const HDWalletProvider = require('truffle-hdwallet-provider');

const addressCountValue = appConfig.getAddressCount().get();
const mnemonicKeyValue = appConfig.getMnemonic().get();
const infuraKeyValue = appConfig.getInfuraKey().get();
const gasKeyValue = appConfig.getGasWei().get();
const gasPriceKeyValue = appConfig.getGasPriceGwei().get();
const defaultAddressIndex = appConfig.getDefaultAddressIndex().get();
const etherscanApiKeyValue = appConfig.getEtherscanApiKey().get();

module.exports = {
	web3: Web3,
	mocha: {
		enableTimeouts: false,
	},
	compilers: {
		solc: {
			version: "0.5.3",
			optimizer: {
				enabled: true,
				runs: 200
			}
		}
	},
	api_keys: {
		etherscan: etherscanApiKeyValue
	},
	plugins: [
		'truffle-plugin-verify'
	],
	verify: {
		preamble: "Author: Guillermo Salazar <guillesalazar@gmail.com>.\nVersion: 1.0.0"
	},
	networks: {
		geth: {
			host: 'localhost',
			port: 8045,
			network_id: '*'
		},
		ganache: {
			host: '127.0.0.1',
			port: 8545,
			network_id: '*',
			function() {
				return new HDWalletProvider(
					mnemonicKeyValue,
					`http://localhost:8545`,
					defaultAddressIndex,
					addressCountValue
				);
			},
			confirmations: 0,
			timeoutBlocks: 50,
			skipDryRun: true
		},
		coverage: {
			host: "127.0.0.1",
			network_id: "*",
			port: 8555,		// <-- If you change this, also set the port option in .solcover.js.
			gas: 0xfffffffffff,	// <-- Use this high gas value
			gasPrice: 0x01	// <-- Use this low gas price
		},
		infuraRinkeby: {
			provider: function() {
				return new HDWalletProvider(
					mnemonicKeyValue,
					`https://rinkeby.infura.io/v3/${infuraKeyValue}`,
					defaultAddressIndex,
					addressCountValue
				);
			},
			gas: gasKeyValue,
			gasPrice: web3.utils.toWei(gasPriceKeyValue, 'gwei'),
			network_id: '4'
		},
		infuraKovan: {
			provider: function() {
				return new HDWalletProvider(
					mnemonicKeyValue,
					`https://kovan.infura.io/v3/${infuraKeyValue}`,
					defaultAddressIndex,
					addressCountValue
				);
			},
			gas: gasKeyValue,
			gasPrice: web3.utils.toWei(gasPriceKeyValue, 'gwei'),
			network_id: '42'
		},
		infuraRopsten: {
			provider: function() {
				return new HDWalletProvider(
					mnemonicKeyValue,
					`https://ropsten.infura.io/v3/${infuraKeyValue}`,
					defaultAddressIndex,
					addressCountValue
				);
			},
			gas: gasKeyValue,
			gasPrice: web3.utils.toWei(gasPriceKeyValue, 'gwei'),
			network_id: '3',
			skipDryRun: true,
		},
		infuraMainnet: {
			provider: function() {
				return new HDWalletProvider(
					mnemonicKeyValue,
					`https://mainnet.infura.io/v3/${infuraKeyValue}`,
					defaultAddressIndex,
					addressCountValue
				);
			},
			gas: gasKeyValue,
			gasPrice: web3.utils.toWei(gasPriceKeyValue, 'gwei'),
			network_id: '1'
		},
		infuraNet: {
			provider: function() {
				return new HDWalletProvider(
					mnemonicKeyValue,
					`https://infuranet.infura.io/v3/${infuraKeyValue}`,
					defaultAddressIndex,
					addressCountValue
				);
			},
			gas: gasKeyValue,
			gasPrice: web3.utils.toWei(gasPriceKeyValue, 'gwei'),
			network_id: '2'
		}
	}
};
