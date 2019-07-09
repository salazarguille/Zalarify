import IZalarify from '../ethereum/abis/IZalarify.json';
import IReceiptRegistry from '../ethereum/abis/IReceiptRegistry.json';
import IZalarifyCompany from '../ethereum/abis/IZalarifyCompany.json';

// StablePay ABIs
import IStablePay from '../ethereum/abis/IStablePay.json';
import IProviderRegistry from '../ethereum/abis/IProviderRegistry.json';

const config = {};

config.ropsten = {
    allowChangeNetwork: false,
    network: 'ropsten',
    explorer: {
        tx: 'https://ropsten.etherscan.io/tx/',
        address: 'https://ropsten.etherscan.io/address/'
    },
    urls: {
        backend: 'https://zalarify-api.herokuapp.com/api/v1',
        // http://localhost:8080/api/v1
    },
    contracts: [
        {
            name: 'IZalarify',
            abi: IZalarify, // ZalarifyBase
            address: '0x08B2fF488D807437Fad2DA3Aa7Db81a67aFF33CD'
        },
        {
            name: 'IZalarifyCompany',
            abi: IZalarifyCompany,
            address: undefined
        },
        {
            name: 'IReceiptRegistry',
            abi: IReceiptRegistry,
            address: '0xD6B5Cd4d327973D6109388DEF81f5776E98733F7'
        },
        {
            name: 'IStablePay',
            abi: IStablePay,
            address: '0xeb1366C0777383BBbbD1E4cA65003B7A6E576742'
        },
        {
            name: 'IProviderRegistry',
            abi: IProviderRegistry,
            address: '0x9E527e631b4edbef9b4b85e4EfCa7702edC96B1c'
        }
    ]
};

config.ganache = {
    allowChangeNetwork: true,
    network: 'Ganache (localhost)',
    explorer: {
        tx: 'https://ropsten.etherscan.io/tx/',
        address: 'https://ropsten.etherscan.io/address/'
    },
    urls: {
        backend: 'http://localhost:8080/api/v1',
    },
    contracts: [
        {
            name: 'IZalarify',
            abi: IZalarify, // ZalarifyBase
            address: ''
        },
        {
            name: 'IZalarifyCompany',
            abi: IZalarifyCompany,
            address: undefined
        },
        {
            name: 'IReceiptRegistry',
            abi: IReceiptRegistry,
            address: ''
        },
        {
            name: 'IStablePay',
            abi: IStablePay,
            address: ''
        },
        {
            name: 'IProviderRegistry',
            abi: IProviderRegistry,
            address: ''
        }
    ]
};

export function getContracts (network) {
    const networkConfig = config[network.toLowerCase()];
    if(networkConfig === undefined) {
        throw new Error(`Not configuration for network ${network}.`);
    }
    return networkConfig.contracts;
};

export function getConfig (network) {
    const networkConfig = config[network.toLowerCase()];
    if(networkConfig === undefined) {
        throw new Error(`Not configuration for network ${network}.`);
    }
    return networkConfig;
};

export function getCurrentConfig () {
    const currentNetwork = process.env.REACT_APP_DEFAULT_NETWORK;
    if(currentNetwork === undefined) {
        throw new Error(`Please set REACT_APP_DEFAULT_NETWORK value in your .env file.`);
    }
    return getConfig(currentNetwork.toLowerCase());
};