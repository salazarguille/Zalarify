/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import {
    getServiceAPI,
} from '../lib/util';

import {
    GANACHE,
    GANACHE_TOKENS,
} from '../util/constants';

export const getCurrencies = async (network) => {
    if (network.toUpperCase() === GANACHE.toUpperCase()) {
        return GANACHE_TOKENS;
    }
    const api = getServiceAPI('KYBER_NETWORK', network);
    const url = `${api}/currencies`;
    const res = await axios.get(url);
    const payload = res.data.data
        .filter(({ symbol }) => symbol !== 'ETH')
        .map(({
            address, symbol, name, decimals,
        }) => ({
            address,
            symbol,
            name,
            decimals,
        }));
    return payload;
};
