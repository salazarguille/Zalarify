/* eslint-disable import/prefer-default-export */
import axios from 'axios';

import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import getContract from '../ethereum/stablepay/StablePayContract';
import {
    getServiceAPI,
    toUnitAmount,
    toBaseAmount,
    getTokenDecimals,
} from '../lib/util';
import { DEFAULT_DECIMALS } from '../util/constants';

const toBN = amount => new BigNumber(amount);
const BNFY = amount => ethers.utils.bigNumberify(amount.dp(0).toString());

export const getTokens = async (network) => {
    const api = getServiceAPI('STABLEPAY', network);

    const res = await axios.get(`${api}/tokens`);
    const payload = res.data.map(
        ({
            address, symbol, name, decimals,
        }) => ({
            address,
            symbol,
            name,
            decimals,
        }),
    );
    return payload;
};

export const getExpectedRates = async (
    sourceToken,
    targetToken,
    sourceAmount,
    network,
) => {
    const contract = await getContract('STABLEPAY_STORAGE', network);
    const decimals = await getTokenDecimals(sourceToken, network) || DEFAULT_DECIMALS;

    const [minRate, maxRate] = await contract.getExpectedRates(
        sourceToken,
        targetToken,
        BNFY(toBaseAmount(sourceAmount, decimals)),
    );

    const payload = {
        expected: toUnitAmount(maxRate, decimals),
        slippage: toUnitAmount(minRate, decimals),
    };
    return payload;
};
