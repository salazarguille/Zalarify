import React, { Component } from 'react';
import _ from 'lodash';
import { getWeb3, getNetwork } from "../util/getWeb3";
import {
    AccountUnavailable,
    InvalidNetwork,
    Web3Loading,
    MetamaskLocked,
} from '../../metamask';

class WithWeb3 extends Component {
    state = {
        loading: true,
        loadingWeb3: true,
        web3: undefined,
        info: {
            network: undefined,
            isEnabled: false,
            isUnlocked: false,
            networkVersion: undefined,
            onboardingComplete: false,
            selectedAddress: undefined,
            selectedAddressBalance: 0,
            isWeb3Injected: false,
            isConnected: false,
            isValidNetwork: false,
        }
    }

    async getBalance(web3, account) {
        const balance = await web3.eth.getBalance(account);
        return {
            balanceWei: balance,
            balanceEther: web3.utils.fromWei(balance, 'ether'),
        };
    }

    createCurrentInfo = async (web3, web3State, getBalance = this.getBalance) => {
        const { network } = this.props;
        const connectionInfo = web3.currentProvider.connection;
        const {
            isEnabled,
            isUnlocked,
            networkVersion,
            onboardingcomplete = false,
        } = web3State;

        const accounts = await web3.eth.getAccounts();
        const publicConfigStoreState = connectionInfo.publicConfigStore._state;

        const selectedAddress = publicConfigStoreState.selectedAddress === undefined ? accounts[0] : publicConfigStoreState.selectedAddress;
        const selectedAddressBalance = selectedAddress !== undefined ? await getBalance(web3, selectedAddress) : undefined;
        
        const info = {
            isEnabled,
            isUnlocked,
            networkVersion,
            onboardingComplete: onboardingcomplete,
            selectedAddress,
            selectedAddressBalance,
            isWeb3Injected: web3 !== undefined,
            isConnected: isEnabled && onboardingcomplete, //&& isUnlocked,
            isValidNetwork: network.toUpperCase() === getNetwork(networkVersion),
            networkId: await web3.eth.net.getId(),
            network: getNetwork(networkVersion),
            accounts,
        };
        // console.log(info);
        return info;
    }

    async componentDidMount() {
        const web3 = await getWeb3();

        const isWeb3Injected = !_.isNull(web3.givenProvider) && !_.isUndefined(web3.givenProvider);
        if(!isWeb3Injected) {
            const info = {
                isEnabled: false,
                isUnlocked: false,
                networkVersion: undefined,
                onboardingComplete: false,
                selectedAddress: undefined,
                selectedAddressBalance: 0,
                isWeb3Injected,
                isConnected: false,
                isValidNetwork: false,
                networkId: undefined,
                network: undefined,
                accounts: [],
            };
            this.setState({
                web3,
                info,
                loading: false
            });
            return;
        }

        const getBalance = this.getBalance;
        web3.givenProvider.publicConfigStore.on('update', async data => {
            // console.log('On metamask update.');
            // console.log(data);
            const info = await this.createCurrentInfo(web3, data, getBalance);
            this.setState({
                ...this.state,
                info,
                loading: !info.onboardingComplete
            });
        });

       const connectionInfo = web3.currentProvider.connection;
       const info = await this.createCurrentInfo(web3, connectionInfo.publicConfigStore._state);
        
        this.setState({
            web3,
            info,
            loading: !info.onboardingComplete
        });
    }

    connectWeb3 = () => {
        window.ethereum.enable();
    };

    render() {
        const { info, loading, web3 } = this.state;
        const { isWeb3Injected, isUnlocked, isValidNetwork } = info;
        const { config } = this.props;
        const size = 'small';

        /*
        1- Metamask connected.
        2- Metamask locked.
        3- Metamask not installed.
        4- Invalid network.
        */

        if (loading){
            // Metamask locked.
            return <Web3Loading size={size} />;
        }

        if (!isWeb3Injected) {
            // Metamask not installed.
            return <AccountUnavailable onClick={this.connectWeb3} size={size}>
                    Connect to Metamask
                </AccountUnavailable>;
        }

        if (!isUnlocked) {
            return <MetamaskLocked onClick={this.connectWeb3} size={size}>
                    Metamask is locked.
                </MetamaskLocked>;
        }

        if (!isValidNetwork){
            // Invalid network.
            return <InvalidNetwork>
                    Please, change Metamask to '{config.name}' network. The current network is {this.state.info.network.toLowerCase()}.
                </InvalidNetwork>
            ;
        }

        let CurrentContractInstance = undefined;
        
        if(this.props.contracts && this.props.currentContract) {
            const currentContractData = this.props.contracts.find( value => value.name === this.props.currentContract);
            if (currentContractData !== undefined) {
                const contract = currentContractData.abi;
                const instance = new web3.eth.Contract(
                    contract.abi,
                    currentContractData.address
                );
                CurrentContractInstance = instance;
            }
        }

        const dapp = {
            config: this.props.config,
            contracts: this.props.contracts,
            web3: this.state.web3,
            info: this.state.info,
            currentContract: CurrentContractInstance
        };

        return this.props.children(dapp);
    }
}

export default WithWeb3;
