import React, { Component } from 'react';
import { getWeb3, getNetwork } from "../util/getWeb3";
import {
    AccountUnavailable,
    InvalidNetwork,
    Web3Unavailable,
    Web3Loading
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

    createWeb3Contracts = (web3) => {
        if(this.props.contracts) {
            this.props.contracts.forEach(contractAbi => console.log(contractAbi.contractName));
        }
        // const instance = new web3.eth.Contract(
        //     SimpleStorageContract.abi,
        //     deployedNetwork && deployedNetwork.address,
        // );
    }

    async componentDidMount() {
        const web3 = await getWeb3();
        const getBalance = this.getBalance;
        web3.givenProvider.publicConfigStore.on('update', async data => {
            const newSelectedAccount = data.selectedAddress;
            if(this.state.info.selectedAddress !== newSelectedAccount) {
                console.log('On updating new account...');
                const currentState = this.state;
                currentState.info.selectedAddress = newSelectedAccount;
                currentState.info.selectedAddressBalance = await getBalance(web3, newSelectedAccount);
                this.setState(currentState);
            }
        });

        const { network } = this.props;
        const connectionInfo = web3.currentProvider.connection;
        const {
            isEnabled,
            isUnlocked,
            networkVersion,
            onboardingcomplete,
            selectedAddress
        } = connectionInfo.publicConfigStore._state;

        const accounts = await web3.eth.getAccounts();

        const info = {
            isEnabled,
            isUnlocked,
            networkVersion,
            onboardingComplete: onboardingcomplete,
            selectedAddress,
            selectedAddressBalance: await getBalance(web3, selectedAddress),
            isWeb3Injected: web3 !== undefined,
            isConnected: isEnabled && isUnlocked && onboardingcomplete,
            isValidNetwork: network.toUpperCase() === getNetwork(networkVersion),
            networkId: await web3.eth.net.getId(),
            network: getNetwork(networkVersion),
            accounts,
        };
        // console.log(info);
        
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
        const { isWeb3Injected, isConnected, isValidNetwork } = info;
        const size = 'small';

        if (loading)
            return <Web3Loading size={size} />;

        if (!isWeb3Injected)
            return <Web3Unavailable size={size}>Install Metamask</Web3Unavailable>

        if (!isConnected)
            return <AccountUnavailable onClick={this.connectWeb3} size={size}>
                    Connect to Metamask
                </AccountUnavailable>;

        if (!isValidNetwork)
            return <InvalidNetwork>
                    Please, change Metamask to {this.props.network} network. The current network is {this.state.info.network.toLowerCase()}.
                </InvalidNetwork>
            ;

        let CurrentContractInstance = undefined;
        
        if(this.props.contracts && this.props.currentContract) {
            const currentContractData = this.props.contracts.find( value => value.name === this.props.currentContract);
            if (currentContractData !== undefined) {
                const contract = currentContractData.abi;
                // const networkId = this.state.info.networkId;
                //const deployedNetwork = contract.abi.networks[networkId];
                const instance = new web3.eth.Contract(
                    contract.abi,
                    currentContractData.address
                    //deployedNetwork && deployedNetwork.address
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
