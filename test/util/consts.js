const { BigNumber } = require( 'bignumber.js');
const util = require('ethereumjs-util');

// tslint:disable-next-line:custom-no-magic-numbers
const ONE_SECOND_MS = 1000;
// tslint:disable-next-line:custom-no-magic-numbers
const ONE_MINUTE_MS = ONE_SECOND_MS * 60;
// tslint:disable-next-line:custom-no-magic-numbers
const TEN_MINUTES_MS = ONE_MINUTE_MS * 10;
// tslint:disable-next-line:custom-no-magic-numbers
const UNLIMITED_ALLOWANCE_IN_BASE_UNITS = new BigNumber(2).pow(256).minus(1);
// tslint:disable-next-line:custom-no-magic-numbers
const DECIMALS = 18;
const ETH_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
const ZERO = new BigNumber(0);
const GANACHE_NETWORK_ID = 50;
const KOVAN_NETWORK_ID = 42;
const ROPSTEN_NETWORK_ID = 3;

const toBytes32 = function (text) {
    return util.bufferToHex(util.setLengthRight(text, 32));
};

module.exports = {
    ONE_SECOND_MS,
    ONE_MINUTE_MS,
    TEN_MINUTES_MS,
    UNLIMITED_ALLOWANCE_IN_BASE_UNITS,
    DECIMALS,
    NULL_ADDRESS,
    ETH_ADDRESS,
    ZERO,
    GANACHE_NETWORK_ID,
    KOVAN_NETWORK_ID,
    ROPSTEN_NETWORK_ID,
    title: function (who, func, desc, fail) {
        const failText = fail ? '\x1b[31mMustFail\x1b[0m .' : '\x1b[0m';
        return '\x1b[32m.' + func + ' => \x1b[36m' + who + '\x1b[0m\033[01;34m : ' + desc + ' '+ failText;
    },
    toBytes: function (text) {
        return util.bufferToHex(text);
    },
    toBytes32,
    toString: function (bytes) {
        return util.toBuffer(bytes).toString();
    },
    createCompanyStruct: (id, name, description, website, owner) => {
        return [
            toBytes32(id),
            toBytes32(name),
            toBytes32(description),
            toBytes32(website),
            owner,
            Date.now(),
            false,
        ];
    },
}
