const check_if = require('../src/check_role.js');
const stopwatch = require('../src/stopwatch')

module.exports = {
    slash: true,
    testOnly: true,
    name: 'clear-all-timers',
    description: 'Clears all timers',
    callback: async (input) => {
        if(!check_if.is_admin(input)) return 'You do not have permissions for this command'
        stopwatch.clear_watches()
        return 'Cleared'
    }
}
