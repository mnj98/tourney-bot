const timer = require('../src/timer.js')
const check_if = require('../src/check_role.js')

module.exports = {
    slash: true,
    testOnly: true,
    name: 'start-timers',
    description: 'Starts tournament timers for a timeslot with a given time',
    minArgs: 2,
    expectedArgs: '<time slot> <minutes>',
    argTypes: [3, 4],
    callback: (input) => {
        if(!check_if.is_admin(input)) return 'You do not have permissions for this command'
        return timer.start_timers(input.args[0], input.args[1], input.client)
    }
}
