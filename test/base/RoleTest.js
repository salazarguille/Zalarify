const Role = artifacts.require("./base/Role.sol");

const leche = require('leche');
const withData = leche.withData;
const t = require('../util/consts').title;
const role = require('../util/events').role;

contract('RoleTest', accounts => {
    const owner = accounts[0];
    const player1 = accounts[3];
    const player2 = accounts[4];
    let instance;

    beforeEach('Deploying contract for each test', async () => {
        instance = await Role.deployed();
    });

    withData({
        _1_player_addPlayer_asAdmin: ['player', 'admin', player1, player1, "Msg sender does not have permission.", true],
        _2_owner_addPlayer_asAdmin: ['anOwner', 'admin', player1, owner, undefined, false],
        _3_owner_addPlayer_asEmpty: ['anOwner', '', player1, owner, 'Role must not be empty.', true],
        _4_owner_addOwner_asAdmin: ['anOwner', 'admin', owner, owner, undefined, false],
        _5_owner_addOwner_asOwner: ['anOwner', 'owner', owner, owner, 'Only one owner.', true],
        _6_owner_addPlayer_asOwner: ['anOwner', 'owner', player2, owner, 'Only one owner.', true]
    }, function(roleText, roleName, accessTo, accessFrom, messageExpected, mustFail) {
        it(t(roleText, 'adminRoleAdd', `Should (or not) able to add a new role.`, mustFail), async function() {
            // Setup

            //Invocation
            try {
                const result = await instance.adminRoleAdd(roleName, accessTo ,{from: accessFrom});
                assert.ok(!mustFail, "It should not have failed.");
                role.roleAdded(result).emitted(accessTo, roleName);
            } catch(error) {
                assert(mustFail, "It should have failed.");
                assert(error);
                assert.equal(error.reason, messageExpected);
            }
        });
    });

    withData({
        _1_player_removePlayer_asAdmin: ['player', 'admin', player1, owner, undefined, false],
        _1_player_removePlayer_asAdmin: ['player', 'user', player1, player2, "Msg sender does not have permission.", true]
    }, function(roleText, roleName, accessTo, accessFrom, messageExpected, mustFail) {
        it(t(roleText, 'adminRoleRemove', `Should (or not) able to remove a new role.`, mustFail), async function() {
            // Setup
            await instance.adminRoleAdd(roleName, accessTo ,{from: owner});

            //Invocation
            try {
                const result = await instance.adminRoleRemove(roleName, accessTo ,{from: accessFrom});
                assert.ok(!mustFail, "It should not have failed.");
                role.roleRemoved(result).emitted(accessTo, roleName);
            } catch(error) {
                assert(mustFail, "It should have failed.");
                assert(error);
                assert.equal(error.reason, messageExpected);
            }
        });
    });
});
