const timer = require('../src/timer.js')
const check_if = require('../src/check_role.js');

module.exports = {
    slash: true,
    testOnly: true,
    name: 'add-time',
    description: 'Add time to a team\'s clock',
    minArgs: 2,
    expectedArgs: '<team> <minutes>',
    argTypes: [3, 4],
    callback: input => {
        if(!check_if.is_admin(input)) return 'You do not have permissions for this command'
        return timer.update_time(input.args[0], input.args[1])
    }
}
