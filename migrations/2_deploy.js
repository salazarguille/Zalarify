const DeployerApp = require('../src/deployer/DeployerApp');

/** Platform configuration keys for smart contracts. */
const STABLE_PAY_NAME = 'StablePay';

/** Platform configuration values. */

// Mock Smart Contracts
const ProxyBaseMock = artifacts.require("./mock/proxy/ProxyBaseMock.sol");
const ProxyTargetMock = artifacts.require("./mock/proxy/ProxyTargetMock.sol");

// Libraries
const AddressArrayLib = artifacts.require("./util/AddressArrayLib.sol");
const SafeMath = artifacts.require("./util/SafeMath.sol");

// Official Smart Contracts
const ReceiptRegistry = artifacts.require("./base/ReceiptRegistry.sol");
const Settings = artifacts.require("./base/Settings.sol");
const Role = artifacts.require("./base/Role.sol");
const Vault = artifacts.require("./base/Vault.sol");
const Storage = artifacts.require("./base/Storage.sol");
const Upgrade = artifacts.require("./base/Upgrade.sol");
const Zalarify = artifacts.require("./Zalarify.sol");
const ZalarifyBase = artifacts.require("./base/ZalarifyBase.sol");
const ZalarifyCompanyFactory = artifacts.require("./base/ZalarifyCompanyFactory.sol");
const ZalarifyCommon = artifacts.require("./ZalarifyCommon.sol");

const allowedNetworks = ['ganache', 'test', 'coverage', 'develop'];

module.exports = function(deployer, network, accounts) {
  console.log(`Deploying smart contracts to '${network}'.`)
  
  const networkIndex = allowedNetworks.indexOf(network);
  if(networkIndex === -1) {
    console.log(`NOT deploying smart contracts to '${network}'.`);
    return;
  }

  const envConf = require('../config')(network === 'infuraRopsten-fork' ? 'infuraRopsten' : network);
  const maxGasForDeploying = envConf.maxGas;
  const stablepayContracts = envConf.stablepay.contracts;
  if(stablepayContracts === undefined || stablepayContracts.StablePay === undefined) {
    throw new Error(`StablePay is undefined for network ${network}/stablepay.js.`);
  }
  if(maxGasForDeploying === undefined) {
    throw new Error(`The 'maxGas' value for deploying is not defined in file config/${network}/index.js file.`);
  }
  
  const stablePayAddress = stablepayContracts.StablePay;
  const owner = accounts[0];

  deployer.deploy(SafeMath).then(async (txInfo) => {
    const deployerApp = new DeployerApp(deployer, web3, owner, network, ["test", "ganache", "coverage"]);
    
    await deployerApp.deploys([
      AddressArrayLib,
      Storage,
      ZalarifyCommon
    ], {gas: maxGasForDeploying});

    await deployerApp.deploy(ReceiptRegistry, Storage.address);
    await deployerApp.deploy(ZalarifyCompanyFactory, Storage.address, {gas: maxGasForDeploying});
    await deployerApp.deploy(Settings, Storage.address, {gas: maxGasForDeploying});
    await deployerApp.deploy(Upgrade, Storage.address, {gas: maxGasForDeploying});
    await deployerApp.deploy(Role, Storage.address, {gas: maxGasForDeploying});
    await deployerApp.deploy(Vault, Storage.address);
    await deployerApp.deploy(Zalarify, Storage.address, {gas: maxGasForDeploying});

    await deployerApp.links(ZalarifyBase, [
      AddressArrayLib,
      SafeMath
    ]);

    await deployerApp.deploy(ZalarifyBase, Storage.address);
    await deployerApp.deployMockIf(ProxyTargetMock, Storage.address);
    await deployerApp.deployMockIf(ProxyBaseMock, Storage.address, 'ProxyTargetMock');

    /***************************************************************
     Saving smart contract permissions/roles and closing platform.
     ***************************************************************/
    const storageInstance = await Storage.deployed();

    /** Storing smart contracts data. */
    await deployerApp.storeContracts(
        storageInstance
    );

    const contractNameSha3 = web3.utils.soliditySha3('contract.name', STABLE_PAY_NAME);
    await storageInstance.setAddress(
      contractNameSha3,
        stablePayAddress
    );
    const contractAddressSha3 = web3.utils.soliditySha3('contract.address', stablePayAddress);
    await storageInstance.setAddress(
        contractAddressSha3,
        stablePayAddress
    );

    /** Setting ownership for specific account. */
    await deployerApp.setOwner(storageInstance, owner);
    /** Finalizing / closing platform. */
    await deployerApp.finalize(storageInstance);

    /****************************************
     Setting platform configuration values.
     ****************************************/
    deployerApp.addData(STABLE_PAY_NAME, stablePayAddress);

    /** Writing smart contract data into JSON file. */
    deployerApp.writeJson(`${Date.now()}_${network}.json`);
    deployerApp.writeJson();
  });
};