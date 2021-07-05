const timer = require('../src/timer.js')
const check_if = require("../src/check_role.js");

module.exports = {
    slash: true,
    testOnly: true,
    name: 'timer-info',
    description: 'Gets info about running timers',
    minArgs: 1,
    expectedArgs: '<time slot>',
    argTypes: [3],
    callback: async (input) => {
        if(!check_if.is_admin(input)) return 'You do not have permissions for this command'

        try{
            const info = await timer.get_timer_info(input.args[0])

            let response = 'Tournament Clock Information:\n'

            info.forEach(item => {
                response += 'Team ' + item.name + ' has ' + (!item.has_completed ?
                    ('**' + item.time_left + '**left') : '**run out of time**') + '\n'
            })
            return response
        }catch(err){

            return 'Error :(  ' + err
        }

    }
}
