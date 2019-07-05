import BigNumber from 'bignumber.js';
import util from 'ethereumjs-util';

export const EMPTY_BYTES_32 = util.bufferToHex(util.setLengthRight(``, 32));
export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
export const ZERO = new BigNumber(0);
export const DEFAULT_DECIMALS = 18;

// network constants
export const HOMESTEAD = 'HOMESTEAD';
export const ROPSTEN = 'ROPSTEN';
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
