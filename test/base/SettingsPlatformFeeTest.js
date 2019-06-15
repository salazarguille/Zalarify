const leche = require('leche');
const withData = leche.withData;

const Settings = artifacts.require("./base/Settings.sol");
const t = require('../util/consts').title;
const settings = require('../util/events').settings;

contract('SettingsPlatformFeeTest', function (accounts) {
    const owner = accounts[0];
    const account1 = accounts[1];
    let instance;

    beforeEach('Setup contract for each test', async () => {
        instance = await Settings.deployed();
    });

    withData({
        _1_basic: []
    }, function() {
        it(t('anUser', 'getPlatformFee', 'Should be able to get the current platform fee.', false), async function() {
            //Setup
            
            //Invocation
            const result = await instance.getPlatformFee();

            // Assertions
            assert(result);
        });
    });

    withData({
        _1_owner_100: [owner, "100", '', false],
        _2_account1_100: [account1, "100", 'Msg sender does not have permission.', true]
    }, function(userAccount, newPlatformFee, expectedMessage, mustFail) {
        it(t('anUser', 'setPlatformFee', 'Should be able to get the current platform fee.', false), async function() {
            //Setup
            const oldPlatformFee = await instance.getPlatformFee();
            
            try {
                //Invocation
                const result = await instance.setPlatformFee(newPlatformFee, {from: userAccount});

                // Assertions
                assert(!mustFail, 'It should have failed because data is invalid.');
                settings
                    .platformFeeUpdated(result)
                    .emitted(instance.address, oldPlatformFee, newPlatformFee);

                const newPlatformFeeResult = await instance.getPlatformFee();
                assert(newPlatformFeeResult);
                assert.equal(newPlatformFeeResult.toString(), newPlatformFee);
            } catch (error) {
                // Assertions
                assert(mustFail);
                assert(error);
                assert.equal(error.reason, expectedMessage);
            }
        });
    });
});