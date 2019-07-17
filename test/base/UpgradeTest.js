const ITransferMock = artifacts.require("./interface/ITransferMock.sol");
const Upgrade = artifacts.require("./base/Upgrade.sol");
const Storage = artifacts.require("./base/Storage.sol");
const Vault = artifacts.require("./base/Vault.sol");
const Role = artifacts.require("./base/Role.sol");

const withData = require('leche').withData;
const t = require('../util/consts').title;
const upgrade = require('../util/events').upgrade;

let oldVault;
let instance;
let _storage;

contract('UpgradeTest', function (accounts) {

    const owner = accounts[0];
    const player = accounts[3];

    beforeEach('Setup contract for each test', async () => {
        oldVault = await Vault.deployed();
        instance = await Upgrade.deployed();
        _storage = await Storage.deployed();
    });

    it(t('owner', 'new', 'Should deploy Upgrade contract.'), async function () {
        assert(instance);
        assert(instance.address);
    });

    it(t('anOwner', 'upgradeContract', 'Should be (or not) able to upgrade contract address.', false), async function () {
        // Setup
        const oldContractAddress = oldVault.address;
        const contractName = 'Vault';
        const newContractInstance = await Vault.new(Storage.address);

        // Invocation
        const result = await instance.upgradeContract(contractName, newContractInstance.address);

        // Assertions
        upgrade
            .contractUpgraded(result)
            .emitted(
                instance.address,
                oldContractAddress,
                newContractInstance.address,
                contractName
            );
        const newValultExpectedByName = await _storage.getAddress(web3.utils.soliditySha3('contract.name', contractName));
        const newValultExpectedByAddress = await _storage.getAddress(web3.utils.soliditySha3('contract.address', newContractInstance.address));
        
        assert.equal(newContractInstance.address, newValultExpectedByAddress);
        assert.equal(newContractInstance.address, newValultExpectedByName);
    });

    it(t('aNewAdmin', 'upgradeContract', 'Should be able to upgrade contract address.'), async function () {
        const contractName = 'Vault';
        const role = await Role.deployed();
        const newContractInstance = await Vault.new(Storage.address);
        const newAdmin = accounts[7];
        const oldVaultAddress = await _storage.getAddress(web3.utils.soliditySha3('contract.name', contractName));

        await role.adminRoleAdd('admin', newAdmin ,{from: owner});

        const result = await instance.upgradeContract(contractName, newContractInstance.address,{from: newAdmin});

        upgrade
            .contractUpgraded(result)
            .emitted(
                instance.address,
                oldVaultAddress,
                newContractInstance.address,
                contractName
            );
        const newTtValultExpectedByName = await _storage.getAddress(web3.utils.soliditySha3('contract.name', contractName));
        const newTtValultExpectedByAddress = await _storage.getAddress(web3.utils.soliditySha3('contract.address', newContractInstance.address));

        assert.equal(newContractInstance.address, newTtValultExpectedByAddress);
        assert.equal(newContractInstance.address, newTtValultExpectedByName);
    });

    it(t('nonOwner', 'upgradeContract', 'Should not be able to upgrade contract address.', true), async function () {
        const contractName = 'Vault';
        const newContractInstance = await Vault.new(_storage.address);
        try {
            await instance.upgradeContract(contractName, newContractInstance.address, {from: player});
            fail('It should have failed because a player cannot upgrade contracts.');
        } catch (error) {
            assert(error);
            assert.equal(error.reason, 'Msg sender does not have permission.');
        }
    });

    it(t('anOwner', 'upgradeContract', 'Should not be able to upgrade contract address with an invalid contract name.', true), async function () {
        const contractName = 'invalidName';
        const newContractInstance = await Vault.new(Storage.address);

        try {
            await instance.upgradeContract(contractName, newContractInstance.address, {from: owner});
            fail('It should have failed because a contract name is invalid.');
        } catch (error) {
            assert(error);
            assert.equal(error.reason, 'Old contract address must not be 0x0.');
        }
    });

    it(t('anOwner', 'upgradeContract', 'Should be able to upgrade contract with ether.', false), async function () {
        // Setup
        const contractName = 'Vault';
        const oldVaultAddress = await _storage.getAddress(web3.utils.soliditySha3('contract.name', contractName));
        const transferMock = await ITransferMock.at(oldVaultAddress);
        const amountWei = await web3.utils.toWei('1', 'ether');
        await transferMock.transferEther({from: owner, value: amountWei});
        const vaultBalance = await web3.eth.getBalance(oldVaultAddress);
        const newContractInstance = await Vault.new(Storage.address);
        
        // Invocation
        const result = await instance.upgradeContract(contractName, newContractInstance.address, {from: owner});

        // Assertions
        assert(result);
        upgrade
            .pendingBalance(result)
            .emitted(instance.address, oldVaultAddress, newContractInstance.address, contractName, vaultBalance);
        upgrade
            .contractUpgraded(result)
            .emitted(instance.address, oldVaultAddress, newContractInstance.address, contractName);
    });
});