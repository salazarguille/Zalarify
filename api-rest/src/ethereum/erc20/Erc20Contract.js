import { ethers } from 'ethers';
import getProvider from '../ethers';
import erc20 from '../abi/erc20.json';

const { abi } = erc20;

const getTokenContract = async (tokenAddress, network) => {
    const networkUpper = network.toUpperCase();
    const tokenContract = new ethers.Contract(
        tokenAddress,
        abi,
        getProvider(networkUpper),
    );
    return tokenContract;
};

export default getTokenContract;
