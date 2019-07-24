import BigNumber from 'bignumber.js';
import util from 'ethereumjs-util';

export const EMPTY_BYTES_32 = util.bufferToHex(util.setLengthRight(``, 32));
export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
export const ZERO = new BigNumber(0);
export const DEFAULT_DECIMALS = 18;

export const GANACHE_URL = 'http://localhost:8545';
export const GANACHE_TOKENS = [
    {
        address: '0x8c13AFB7815f10A8333955854E6ec7503eD841B7',
        symbol: 'KNC',
        decimals: '18',
        name: 'KNC',
    },
    {
        address: '0x3750bE154260872270EbA56eEf89E78E6E21C1D9',
        symbol: 'OMG',
        decimals: '18',
        name: 'OMG',
    },
    {
        address: '0x7ADc6456776Ed1e9661B3CEdF028f41BD319Ea52',
        symbol: 'SALT',
        decimals: '8',
        name: 'SALT',
    },
    {
        address: '0x400DB523AA93053879b20F10F56023b2076aC852',
        symbol: 'ZIL',
        decimals: '12',
        name: 'ZIL',
    },
    {
        address: '0xe19Ec968c15f487E96f631Ad9AA54fAE09A67C8c',
        symbol: 'MANA',
        decimals: '18',
        name: 'MANA',
    }
];
// network constants
export const HOMESTEAD = 'HOMESTEAD';
export const ROPSTEN = 'ROPSTEN';
export const GANACHE = 'GANACHE';
export const DEFAULT_TOKEN = 'DAI';

export const PLATFORM_FEE_DIVIDER = 100;
export const SECONDS_TO_MILLIS_MULTIPLIER = 1000;

// token constants
export const ETHEREUM_TOKEN_ADDR = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

// Smart contract names

export const PROVIDER_REGISTRY = 'PROVIDER_REGISTRY';
export const STABLEPAY = 'STABLEPAY';

export const RECEIPT_REGISTRY = 'RECEIPT_REGISTRY';
export const ZALARIFY = 'ZALARIFY';
export const ZALARIFY_COMPANY = 'ZALARIFY_COMPANY';

export const KYBER_NETWORK_PROVIDER_KEY = '0x4b796265724e6574776f726b5f76310000000000000000000000000000000000';