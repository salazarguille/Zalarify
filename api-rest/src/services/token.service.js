/* eslint-disable import/prefer-default-export */
import { getCurrencies } from './kyberNetwork.service';
import config from '../env';

const ETHEREUM_NETWORK = config.DEFAULT_ETHEREUM_NETWORK;

export const getTokenDataByAddress = async (address, network = ETHEREUM_NETWORK) => {
    const tokens = await getCurrencies(network);
    const foundToken = tokens.find(
        token => token.address.toUpperCase() === address.toUpperCase(),
    );

    return foundToken;
};

export const getTokenDataBySymbol = async (symbol, network = ETHEREUM_NETWORK) => {
    const tokens = await getCurrencies(network);
    const foundToken = tokens.find(
        token => token.symbol.toUpperCase() === symbol.toUpperCase(),
    );

    return foundToken;
};
