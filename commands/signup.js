
module.exports = {
    slash: true,
    testOnly: true,
    name: 'signup',
    description: 'Allows you to sign up for the tournament',
    minArgs: 6,
    expectedArgs: '<TeamName> <Tier> <Player1> <Player2> <Player3> <Player4> [Sub1] [Sub2]',
    /*options: [{name:'team_name'},
        {name:'tier'},
        {name:'player1'},
        {name:'player1'},
        {name:'player1'},
        {name:'player1'},
        {name:'sub1'},
        {name:'sub2'}],*/
    callback: ({args}) => {
        console.log(args)
        return 'ok'
    }
}
