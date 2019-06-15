const _ = require('lodash');
const leche = require('leche');
const withData = leche.withData;

const BaseMock = artifacts.require("./mock/BaseMock.sol");
const Storage = artifacts.require("./base/Storage.sol");
const Settings = artifacts.require("./base/Settings.sol");

const t = require('../util/consts').title;

contract('BaseModifiersTest', function (accounts) {
    const owner = accounts[0];
    const sponsor = accounts[0];

    let base;
    let settings;
    
    beforeEach('Setup contract for each test', async () => {
        const storage = await Storage.deployed();

        base = await BaseMock.new(storage.address);
        assert(base);
        assert(base.address);

        settings = await Settings.deployed();
        assert(settings);
        assert(settings.address);
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
        });
    });
});