const signup_handler = require('../src/signup.js')


module.exports = {
    slash: true,
    testOnly: true,
    name: 'signup',
    description: 'Allows you to sign up for the tournament',
    minArgs: 6,
    maxArgs: 8,
    expectedArgs: '<team name> <tier> <player1> <player2> <player3> <player4> [sub1] [sub2]',
    argTypes: [3, 3, 9, 9, 9, 9, 9, 9],
    callback: async (input) => {
        const response = await signup_handler.signup_handler(input.args, input.guild)
        console.log('response: ' + response + ' type: ' + typeof response)
        return 'no'
    }
}
