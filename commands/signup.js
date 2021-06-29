
module.exports = {
    slash: true,
    testOnly: true,
    name: 'signup',
    description: 'Allows you to sign up for the tournament',
    minArgs: 6,
    expectedArgs: '<Team Name> <Tier> <Player1> <Player2> <Player3> <Player4> [Sub1] [Sub2]',
    options: ['team_name', 'tier', 'player1', 'player1', 'player1', 'player1', 'sub1', 'sub2'],
    callback: ({args}) => {
        console.log(args)
        return 'ok'
    }
}
