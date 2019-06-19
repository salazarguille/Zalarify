const withData = require('leche').withData;

const BaseMock = artifacts.require("./mock/BaseMock.sol");
const Storage = artifacts.require("./base/Storage.sol");
const Role = artifacts.require("./base/Role.sol");
const Settings = artifacts.require("./base/Settings.sol");

const t = require('../util/consts').title;

contract('BaseTest', function (accounts) {
    const owner = accounts[0];
    const account1 = accounts[1];
    const account2 = accounts[2];
    const account3 = accounts[3];
    const account4 = accounts[4];

    let base;
    let settings;
    let role;
    
    beforeEach('Setup contract for each test', async () => {
        const storage = await Storage.deployed();

        base = await BaseMock.new(storage.address);
        assert(base);
        assert(base.address);

        settings = await Settings.deployed();
        assert(settings);
        assert(settings.address);

        role = await Role.deployed();
        assert(role);
        assert(role.address);
    });

    withData({
        _1_pause_mustFail: [true, 'Platform is paused.',  true],
        _2_unpause_noMustFail: [false, undefined, false]
    }, function(pausePlatform, messageExpected, mustFail) {
        it(t('anUser', '_isNotPaused', 'Should be able (or not) to execute function with/without paused platform.', mustFail), async function() {
            // Setup
            if(pausePlatform) {
                await settings.pausePlatform('Pause reason', {from: owner});
            } else {
                await settings.unpausePlatform('Unpause reason', {from: owner});
            }

            // Invocation
            try {
                await base._isNotPaused();
                // Assertions
                assert(!mustFail, "It should not have failed.");
            } catch (error) {
                // Assertions
                assert(mustFail, "It should have failed.");
                assert(error.message.includes(messageExpected));
            }

            await settings.unpausePlatform('Unpause reason', {from: owner});
        });
    });

    withData({
        _1_owner_mustNotFail: [owner, undefined,  false],
        _2_acount1_mustFail: [account1, 'Invalid role', true]
    }, function(address, messageExpected, mustFail) {
        it(t('anUser', '_onlyOwner', 'Should be able (or not) to execute function only for owners.', mustFail), async function() {
            // Setup

            // Invocation
            try {
                await base._onlyOwner({ from: address});
                // Assertions
                assert(!mustFail, "It should not have failed.");
            } catch (error) {
                // Assertions
                assert(mustFail, "It should have failed.");
                assert(error.message.includes(messageExpected));
            }
        });
    });

    withData({
        _1_account2_asAdmin_mustNotFail: [account2, true, undefined,  false],
        _1_account2_notAsAdmin_mustFail: [account3, false, 'Invalid role',  true]
    }, function(address, addAsAdmin, messageExpected, mustFail) {
        it(t('anUser', '_onlyAdmin', 'Should be able (or not) to execute function for owners/admins.', mustFail), async function() {
            // Setup
            if (addAsAdmin) {
                await role.adminRoleAdd('admin', address, { from: owner});
            }

            // Invocation
            try {
                await base._onlyAdmin({ from: address});
                // Assertions
                assert(!mustFail, "It should not have failed.");
            } catch (error) {
                // Assertions
                assert(mustFail, "It should have failed.");
                assert(error.message.includes(messageExpected));
            }

            if (addAsAdmin) {
                await role.adminRoleRemove('admin', address, { from: owner});
            }
        });
    });
});