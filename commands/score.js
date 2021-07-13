const Discord = require('discord.js')
const ScoreHandler = require('../src/score.js')

const defeat_url = 'https://raw.githubusercontent.com/mnj98/tourney-bot/master/loss.png'
const x = ':x:'

module.exports = {
    slash: true,
    testOnly: true,
    name: 'calculate-score',
    description: 'Calculates score. Use 0 attempts to represent a failed map',
    minArgs: 12,
    maxArgs: 12,
    expectedArgs: '<map1> <difficulty1> <attempts1> ' +
        '<map2> <difficulty2> <attempts2> ' +
        '<map3> <difficulty3> <attempts3> ' +
        '<map4> <difficulty4> <attempts4>',
    argTypes: [3, 3, 4, 3, 3, 4, 3, 3, 4, 3, 3, 4],
    callback: async input => {
        try{
            return new Discord.MessageEmbed()
                .setTitle('Score')
                .setFooter('Be more specific if the map name or difficulty is incorrect')
                .setColor('NAVY')
                .addFields(create_fields(await ScoreHandler.score_handler(input.args)))
        }
        catch(err){
            return new Discord.MessageEmbed()
                .setTitle(x + x + ' Score Calculation Failed ' + x + x)
                .setFooter('Try Again')
                .addField('Reason', err + '')
                .setThumbnail(defeat_url)
                .setColor('RED')
        }
    }
}

function create_fields(result){
    const [maps, diffs, attempts, score] = result
    const adjusted_attempts = attempts.map(_ => _ === 0 ? 'Map Failed' : _)

    let fields = [{
        name: 'Total',
        value: score,
    }]

    for(let i = 0; i < maps.length; i++){
        fields.push({name: 'Map', value: maps[i], inline: true})
        fields.push({name: 'Difficulty', value: diffs[i], inline: true})
        fields.push({name: 'Number of attempts', value: adjusted_attempts[i], inline: true})
    }
    return fields
}
