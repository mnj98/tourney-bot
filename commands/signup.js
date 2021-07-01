const signup = require('../src/signup.js')


module.exports = {
    slash: true,
    testOnly: true,
    name: 'signup',
    description: 'Allows you to sign up for the tournament',
    minArgs: 6,
    maxArgs: 8,
    expectedArgs: '<team name> <tier> <player1> <player2> <player3> <player4> [sub1] [sub2]',
    argTypes: [3, 3, 9, 9, 9, 9, 9, 9],
    callback: async input => {
        if(input.interaction.channel_id !== global.signup_channel_id) return 'Please use the signup channel'
        try{
            return await signup.signup_handler(input.args, input.guild)
        }
        catch(err){
            return 'Signup failed: ' + err
        }
    }
}
