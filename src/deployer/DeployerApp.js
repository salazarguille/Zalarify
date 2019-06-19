const _ = require('lodash');
const fs = require('fs');
const jsonfile = require('jsonfile');
const ContractInfo = require('./ContractInfo');

class DeployerApp {
    constructor(deployer, web3, account, network, mockNetworks = ["test"], verbose = true) {
        this.data = new Map();
        this.verbose = verbose;
        this.web3 = web3;
        this.account = account;
        this.contracts = [];
        this.deployer = deployer;
        this.network = network;
        this.mockNetworks = mockNetworks;
    }
}

DeployerApp.prototype.deployWith = async function(contractName, contract, ...params) {
    // https://ethereum.stackexchange.com/questions/42950/how-to-get-the-transaction-cost-in-a-truffle-unit-test
    // const estimatedGas = await contract.new.estimateGas(...params);
    // console.log(`Estimated Gas: ${estimatedGas.toString()}`);
    await this.deployer.deploy(contract, ...params);
    const newContractInfo = new ContractInfo(
        this.web3,
        this.contracts.length + 1,
        contract.address,
        contractName
    );
    this.contracts.push(newContractInfo);
}

DeployerApp.prototype.deploy = async function(contract, ...params) {
    await this.deployWith(contract.contractName, contract, ...params);
}

DeployerApp.prototype.addData = function(key, data) {
    this.data.set(key, data);
}

DeployerApp.prototype.canDeployMock = function() {
    return this.mockNetworks.indexOf(this.network) > -1;
}

DeployerApp.prototype.deployMockIf = async function(contract, ...params) {
    if(this.canDeployMock()) {
        await this.deploy(contract, ...params);
    }
}

DeployerApp.prototype.deployMocksIf = async function(contracts, ...params) {
    for (const key in contracts) {
        if (contracts.hasOwnProperty(key)) {
            const contract = contracts[key];
            await this.deployMockIf(contract, ...params);
        }
    }
}

DeployerApp.prototype.deploys = async function(contracts, ...params) {
    for (const key in contracts) {
        if (contracts.hasOwnProperty(key)) {
            const contract = contracts[key];
            await this.deploy(contract, ...params);
        }
    }
}

DeployerApp.prototype.links = async function(contract, libraries) {
    for (const key in libraries) {
        if (libraries.hasOwnProperty(key)) {
            const library = libraries[key];
            await this.deployer.link(library, contract);
        }
    }
}

DeployerApp.prototype.writeJson = function(outputJson = 'contracts.json', folder = './build/') {
    const jsonData = {
        contracts: [],
        data: []
    };

    for (const contractInfo of this.contracts) {
        jsonData.contracts.push({
            order: contractInfo.order,
            address: contractInfo.address,
            name: contractInfo.name,
            costs: contractInfo.costs,
            data: contractInfo.data
        });
    }

    const keys = Array.from(this.data.keys());

    for (const key of keys) {
        jsonData.data.push({
            key: key,
            value: this.data.get(key)
        });
    }

    if(!fs.existsSync(folder)) {
        console.log(`Creating output folder '${folder}'.`)
        fs.mkdirSync(folder, { recursive: true });
    }
    const outputFile = `${folder}${outputJson}`;
    jsonfile.writeFile(outputFile, jsonData, {flag: 'a', spaces: 4, EOL: '\r\n'}, function (err) {
      console.log(`JSON file created at '${outputJson}'.`);
      if(err) {
        console.error("Errors: " + err);
      }
    });
}

DeployerApp.prototype.writeCustomJson = function(customFileProcessor, outputJson = './build/contracts.json') {
    const data = {
        contracts: this.contracts,
        data: this.data
    };
    const jsonData = customFileProcessor(data);

    jsonfile.writeFile(outputJson, jsonData, {spaces: 4, EOL: '\r\n'}, function (err) {
      console.log(`Custom JSON file created at '${outputJson}'.`);
      if(err) {
        console.error("Errors: " + err);
      }
    });
}

DeployerApp.prototype.getContractData = function(contractName) {
    for (const contract of this.contracts) {
        if(contract.name.toLowerCase() === contractName.toLowerCase() ) {
            return contract;
        }
    }
    return undefined;
}

DeployerApp.prototype.storeContract = async function(storageInstance, contractInfo) {
    //const contractInfo = this.getContractData(contract.contractName);
    console.log(`Storing contract info '${contractInfo.name}' => ${contractInfo.address}`)
    const contractNameSha3 = this.web3.utils.soliditySha3('contract.name', contractInfo.name);
    await storageInstance.setAddress(
        contractNameSha3,
        contractInfo.address
    );
    //console.log(`SHA3 ('contract.name','${contract.contractName}') = '${contractNameSha3}'`);

    const contractAddressSha3 = this.web3.utils.soliditySha3('contract.address', contractInfo.address);
    await storageInstance.setAddress(
        contractAddressSha3,
        contractInfo.address
    );
    //console.log(`SHA3 ('contract.address','${contract.address}') = '${contractAddressSha3}'`);
    contractInfo.data.sha3 = {};
    contractInfo.data.sha3[`contract_address_${contractInfo.address}`] = contractAddressSha3;
    contractInfo.data.sha3[`contract_name_${contractInfo.name}`] = contractNameSha3;
}

DeployerApp.prototype.storeContracts = async function(storageInstance, ...contracts) {
    for (const contract of this.contracts) {
        await this.storeContract(storageInstance, contract);
    }
}

DeployerApp.prototype.setOwner = async function(storageInstance, ownerAddress) {
    console.log(`Setting platform owner to address ${ownerAddress}.`);
    const contractNameOwnerSha3 = this.web3.utils.soliditySha3('contract.name', 'owner');
    await storageInstance.setAddress(
        contractNameOwnerSha3,
        ownerAddress
    );
    this.addData(`contract.name_owner`,{
        sha3: contractNameOwnerSha3,
        ownerAddress: ownerAddress
    });
    
    // Register owner in bool
    const accessRoleOwnerSha3 = this.web3.utils.soliditySha3('access.role', 'owner', ownerAddress);
    await storageInstance.setBool(
        accessRoleOwnerSha3,
        true
    );
    this.addData(`access.role_owner_${ownerAddress}`, {
        sha3: accessRoleOwnerSha3,
        value: true
    });
}

DeployerApp.prototype.finalize = async function(storageInstance) {
    // Disable direct access to storage now
    console.log(`Disabling direct access to storage.`);
    const contractStorageInitialisedSha3 = this.web3.utils.soliditySha3('contract.storage.initialised');
    await storageInstance.setBool(
        contractStorageInitialisedSha3,
        true
    );
    this.addData(`contract.storage.initialised`, {
        sha3: contractStorageInitialisedSha3,
        value: true
    });
}

module.exports = DeployerApp;