import IZalarify from '../ethereum/abis/IZalarify.json';
import IReceiptRegistry from '../ethereum/abis/IReceiptRegistry.json';
import IZalarifyCompany from '../ethereum/abis/IZalarifyCompany.json';

// StablePay ABIs
import IStablePay from '../ethereum/abis/IStablePay.json';
import IProviderRegistry from '../ethereum/abis/IProviderRegistry.json';

// ERC20
import ERC20 from '../ethereum/abis/ERC20.json';

const config = {};

config.ropsten = {
    maxGas: 7000000,
    allowChangeNetwork: false,
    network: 'ropsten',
    explorer: {
        tx: 'https://ropsten.etherscan.io/tx/',
        address: 'https://ropsten.etherscan.io/address/'
    },
    urls: {
        backend: 'https://zalarify-api.herokuapp.com/api/v1',
    },
    contracts: [
        {
            name: 'IZalarify',
            abi: IZalarify,
            address: '0x5Cf178be207bF1778fD97AB6157C44E8fA893563'
        },
        {
            name: 'IZalarifyCompany',
            abi: IZalarifyCompany,
            address: undefined
        },
        {
            name: 'IReceiptRegistry',
            abi: IReceiptRegistry,
            address: '0x001250566C84F5c878532e9D3610035512f6fdCD'
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
        },
        {
            name: 'ERC20',
            abi: ERC20,
            address: undefined
        }
    ]
};

config.ganache = {
    maxGas: 6500000,
    allowChangeNetwork: true,
    network: 'unknown',
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
            abi: IZalarify,
            address: '0x5dba06C7663b31bc17187A38B3d8759477BE3A0f'
        },
        {
            name: 'IZalarifyCompany',
            abi: IZalarifyCompany,
            address: undefined
        },
        {
            name: 'IReceiptRegistry',
            abi: IReceiptRegistry,
            address: '0x85677e1debD4a74868f462A2dea7890dF4cAFb78'
        },
        {
            name: 'IStablePay',
            abi: IStablePay,
            address: '0xC7425Bc338226BF4256EA86246FeF1C7e81BDF0E'
        },
        {
            name: 'IProviderRegistry',
            abi: IProviderRegistry,
            address: '0x37fb1B54BC36FfFc8FecB71344059cf208876D1C'
        },
        {
            name: 'ERC20',
            abi: ERC20,
            address: undefined
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