const config = require("../truffle");
const appConfig = require('../src/config');

const DeployerApp = require('../src/deployer/DeployerApp');

/** Platform configuration keys for smart contracts. */
const PLATFORM_FEE_KEY = 'config.platform.fee';

/** Platform configuration values. */
const printDeployCostValue = appConfig.getPrintDeployCost().get();
const platformFee = appConfig.getPlatformFee().get();
const maxGasForDeploying = 5000000;

// Mock Smart Contracts

// Libraries
const Bytes32ArrayLib = artifacts.require("./util/Bytes32ArrayLib.sol");
const SafeMath = artifacts.require("./util/SafeMath.sol");
const AddressLib = artifacts.require("./util/AddressLib.sol");
console.log('333');
// Official Smart Contracts
const Settings = artifacts.require("./base/Settings.sol");
const Role = artifacts.require("./base/Role.sol");
const Vault = artifacts.require("./base/Vault.sol");
const Storage = artifacts.require("./base/Storage.sol");
const Upgrade = artifacts.require("./base/Upgrade.sol");
const Zalarify = artifacts.require("./Zalarify.sol");
const ZalarifyBase = artifacts.require("./base/ZalarifyBase.sol");
const ZalarifyCommon = artifacts.require("./ZalarifyCommon.sol");

const allowedNetworks = ['ganache', 'test', 'coverage'];

module.exports = function(deployer, network, accounts) {
  console.log(`Deploying smart contracts to '${network}'.`)
  
  const networkIndex = allowedNetworks.indexOf(network);
  if(networkIndex === -1) {
    console.log(`NOT deploying smart contracts to '${network}'.`);
    return;
  }

  // const envConf = require('../config')(network);
  
  const owner = accounts[0];

  deployer.deploy(SafeMath).then(async (txInfo) => {
    const deployerApp = new DeployerApp(deployer, web3, owner, network);
    
    await deployerApp.deploys([
      Bytes32ArrayLib,
      Storage,
      ZalarifyCommon,
      AddressLib
    ], {gas: maxGasForDeploying});

    await deployerApp.deploy(Settings, Storage.address, {gas: maxGasForDeploying});
    await deployerApp.deploy(Upgrade, Storage.address, {gas: maxGasForDeploying});
    await deployerApp.deploy(Role, Storage.address, {gas: maxGasForDeploying});
    await deployerApp.deploy(Vault, Storage.address);
    await deployerApp.deploy(Zalarify, Storage.address, {gas: maxGasForDeploying});

    await deployerApp.links(ZalarifyBase, [
      SafeMath
    ]);
    await deployerApp.deploy(ZalarifyBase, Storage.address, {gas: maxGasForDeploying});

    /***************************************************************
     Saving smart contract permissions/roles and closing platform.
     ***************************************************************/
    const storageInstance = await Storage.deployed();

    /** Storing smart contracts data. */
    await deployerApp.storeContracts(
        storageInstance
    );

    /** Setting ownership for specific account. */
    await deployerApp.setOwner(storageInstance, owner);
    /** Finalizing / closing platform. */
    await deployerApp.finalize(storageInstance);

    /****************************************
     Setting platform configuration values.
     ****************************************/
    const settingsInstance = await Settings.deployed();
    await settingsInstance.setPlatformFee(platformFee, {from: owner});
    deployerApp.addData(PLATFORM_FEE_KEY, platformFee);

    /** Writing smart contract data into JSON file. */
    deployerApp.writeJson(`./build/${Date.now()}_${network}.json`);
    deployerApp.writeJson();

    if(printDeployCostValue === true) {
      deployerApp.prettyPrint(true);
    }
  });
};