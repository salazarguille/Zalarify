import { getCurrencies } from '../services/kyberNetwork.service';
import { getExpectedRates } from '../services/stablepay.service';
import { getTokenDataByAddress, getTokenDataBySymbol } from '../services/token.service';
import config from '../env';
import { getTokenAddress, isAddress } from '../lib/util';
import { DEFAULT_TOKEN } from '../util/constants';

import BadRequestError from '../lib/errors/BadRequestError';

const ETHEREUM_NETWORK = config.DEFAULT_ETHEREUM_NETWORK;

const TokenController = {
    getAll: (network = ETHEREUM_NETWORK) => getCurrencies(network),

    getBySymbolOrAddress: async (symbolOrAddress, network = ETHEREUM_NETWORK) => {
        let foundToken;
        if (isAddress(symbolOrAddress)) {
            foundToken = await getTokenDataByAddress(symbolOrAddress, network);
        } else {
            foundToken = await getTokenDataBySymbol(symbolOrAddress, network);
        }
        if (!foundToken) {
            throw new BadRequestError(`Token with symbol/address ${symbolOrAddress} not found.`);
        }
        return foundToken;
    },

    getByAddress: async (address, network = ETHEREUM_NETWORK) => {
        const foundToken = await getTokenDataByAddress(address, network);
        if (!foundToken) {
            throw new BadRequestError(`Token with address ${address} not found.`);
        }
        return foundToken;
    },

    /** 
     * NOTE: if  targetSymbolOrAddress argument is not provided expectedRate
     * defaults to target token DAI
     * */
    getExpectedRate: async (
        symbolOrAddress,
        targetAmount = 1,
        network = ETHEREUM_NETWORK,
        targetSymbolOrAddress = getTokenAddress(DEFAULT_TOKEN, network),
    ) => {
        const sourceTokenPromise = TokenController.getBySymbolOrAddress(symbolOrAddress, network);
        const targetTokenPromise = TokenController.getBySymbolOrAddress(targetSymbolOrAddress, network);

        const [sourceToken, targetToken] = await Promise.all([sourceTokenPromise, targetTokenPromise]);
        const source = sourceToken.address;
        const target = targetToken.address;
        const rate = await getExpectedRates(source, target, targetAmount, network);

        const payload = {
            minRate: rate.minRate,
            maxRate: rate.maxRate,
            minRateUnit: rate.minRateUnit,
            maxRateUnit: rate.maxRateUnit,
            provider: rate.provider,
            providerKey: rate.providerKey,
            targetAmount: rate.targetAmount,
        };
        return payload;
    },
};

export default TokenController;
