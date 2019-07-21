import IZalarify from '../ethereum/abis/IZalarify.json';
import IReceiptRegistry from '../ethereum/abis/IReceiptRegistry.json';
import IZalarifyCompany from '../ethereum/abis/IZalarifyCompany.json';

// StablePay ABIs
import IStablePay from '../ethereum/abis/IStablePay.json';
import IProviderRegistry from '../ethereum/abis/IProviderRegistry.json';

// ERC20
import ERC20 from '../ethereum/abis/ERC20.json';

export const config = {
        maxGas: 7000000,
        confirmations: 2,
        allowChangeNetwork: false,
        network: 'ropsten',
        name: 'Ropsten (testnet)',
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
                address: '0x34fEC398d86e10d266153DaC9E3e38845182a6F7'
            },
            {
                name: 'IZalarifyCompany',
                abi: IZalarifyCompany,
                address: undefined
            },
            {
                name: 'IReceiptRegistry',
                abi: IReceiptRegistry,
                address: '0xB245dF8eF71839d84D06a87206aC54Cb4034511d'
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