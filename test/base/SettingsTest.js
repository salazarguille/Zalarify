const leche = require('leche');
const withData = leche.withData;

const Storage = artifacts.require("./base/Storage.sol");
const Settings = artifacts.require("./base/Settings.sol");
const t = require('../util/consts').title;
const settings = require('../util/events').settings;

contract('SettingsTest', function (accounts) {
    const owner = accounts[0];
    const account1 = accounts[1];
    let instance;

    beforeEach('Setup contract for each test', async () => {
        const storage = await Storage.deployed();
        instance = await Settings.deployed();
    });

    withData({
        _1_owner: [owner, "Pause platform I", undefined, false],
        _2_account1_invalid: [account1, "Pause platform II", 'Msg sender does not have permission.', true]
    }, function(userAccount, reason, expectedMessage, mustFail) {
        it(t('anUser', 'pausePlatform', 'Should be able (or not) to pause the platform.', mustFail), async function() {
            //Setup
            try {
                //Invocation
                const result = await instance.pausePlatform(reason, {from: userAccount});

                // Assertions
                assert(!mustFail, 'It should have failed because data is invalid.');
                settings
                    .platformPaused(result)
                    .emitted(instance.address, reason);
                const isPlatformPausedResult = await instance.isPlatformPaused();
                assert(isPlatformPausedResult);
            } catch (error) {
                // Assertions
                assert(mustFail);
                assert(error);
                assert.equal(error.reason, expectedMessage);
            } finally {
                if(!mustFail) {
                    await instance.unpausePlatform(reason, {from: owner});
                }
            }
        });
    });

    withData({
        _1_owner: [owner, "Pause platform I", false, undefined, false],
        _2_notOwner: [account1, "Pause platform II", false, 'Msg sender does not have permission.', true],
    }, function(userAccount, reason, isPlatformPausedExpected, expectedMessage, mustFail) {
        it(t('anUser', 'unpausePlatform', 'Should be able to get the current platform fee.', mustFail), async function() {
            //Setup
            const isPlatformPausedResult = await instance.isPlatformPaused();
            if (!isPlatformPausedResult) {
                await instance.pausePlatform('Needed to test it.', {from: owner});
            }

            try {
                //Invocation
                const result = await instance.unpausePlatform(reason, {from: userAccount});

                // Assertions
                assert(!mustFail, 'It should have failed because data is invalid.');
                assert(result);
                settings
                    .platformUnpaused(result)
                    .emitted(instance.address, reason);
                const isPlatformPausedResult = await instance.isPlatformPaused();
                assert.equal(isPlatformPausedResult, isPlatformPausedExpected);
            } catch (error) {
                // Assertions
                assert(mustFail);
                assert(error);
                assert.equal(error.reason, expectedMessage);
            } finally {
                const isPlatformPausedResult = await instance.isPlatformPaused();
                if (isPlatformPausedResult) {
                    await instance.unpausePlatform(reason, {from: owner});
                }
            }
        });
    });

    withData({
        _1_isNotPaused: [false, false],
        _2_isPaused: [true, true],
    }, function(pauseBefore, isPlatformPausedExpected) {
        it(t('anUser', 'isPlatformPaused', 'Should be able to get the current platform status.', false), async function() {
            //Setup
            if (pauseBefore) {
                await instance.pausePlatform('Needed to test it I.', {from: owner});
            }

            //Invocation
            const result = await instance.isPlatformPaused();

            // Assertions
            assert.equal(result, isPlatformPausedExpected);

            if (pauseBefore) {
                await instance.unpausePlatform('Needed to test it II', {from: owner});
            }
        });
    });
});