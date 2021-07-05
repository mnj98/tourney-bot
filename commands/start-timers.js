const timer = require('../src/timer.js')

module.exports = {
    slash: true,
    testOnly: true,
    name: 'start-timers',
    description: 'Starts tournament timers for a timeslot with a given time',
    minArgs: 2,
    expectedArgs: '<time slot> <minutes>',
    argTypes: [3, 4],
    callback: (input) => {
        console.log(input)
        if(input.interaction.channel_id !== process.env.signup_channel_id) return 'Please use the signup channel'
        timer.start_timers(input.args[0], input.args[1])
        return 'Timers started'
    }
}
