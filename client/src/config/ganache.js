import IZalarify from '../ethereum/abis/IZalarify.json';
import IReceiptRegistry from '../ethereum/abis/IReceiptRegistry.json';
import IZalarifyCompany from '../ethereum/abis/IZalarifyCompany.json';

// StablePay ABIs
import IStablePay from '../ethereum/abis/IStablePay.json';
import IProviderRegistry from '../ethereum/abis/IProviderRegistry.json';

// ERC20
import ERC20 from '../ethereum/abis/ERC20.json';

export const config = {
    maxGas: 6500000,
    confirmations: 1,
    allowChangeNetwork: true,
    network: 'unknown',
    name: 'Local Ganache',
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
            address: '0x6a376f32EC6D1d5b31b1c0F6072C8fc1181a8379'
        },
        {
            name: 'IZalarifyCompany',
            abi: IZalarifyCompany,
            address: undefined
        },
        {
            name: 'IReceiptRegistry',
            abi: IReceiptRegistry,
            address: '0x1e9eE0a8a2090F2728BF8293AfbECE9eC3388ed1'
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
