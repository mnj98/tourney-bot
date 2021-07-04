const timer = require('../src/timer.js')

module.exports = {
    slash: true,
    testOnly: true,
    name: 'add-time',
    description: 'Add time to a team\'s clock',
    minArgs: 2,
    expectedArgs: '<team> <minutes>',
    argTypes: [3, 4],
    callback: (input) => {
        if(input.interaction.channel_id !== process.env.signup_channel_id) return 'Please use the signup channel'
        timer.update_time(input.args[0], input.args[1])
        return 'Time added'
    }
}
