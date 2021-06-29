
module.exports = {
    slash: true,
    testOnly: true,
    name: 'signup',
    description: 'Allows you to sign up for the tournament',
    minArgs: 6,
    maxArgs: 8,
    expectedArgs: '<team name> <tier> <player1> <player2> <player3> <player4> [sub1] [sub2]',
    callback: ({args, text}) => {
        console.log('text: ' + text)
        args.forEach(arg => {
            console.log('arg: ' + arg)
	})
        return 'ok'
    }
}
