/**
 * Parse and calculate score using the score sheet
 */

const Discord = require('discord.js')
const ScoreHandler = require('../score.js')

const defeat_url = 'https://raw.githubusercontent.com/mnj98/tourney-bot/master/loss.png'
const x = ':x:'

//All of this represents the 4 sub commands
const
    map1 = [
        {type: 3, name: 'map1', description: 'Map 1', required: true},
        {type: 3, name: 'difficulty1', description: 'Difficulty', required: true},
        {type: 4, name: 'attempts1', description: 'Number of Attempts', required: true}
    ],
    map2 = map1.concat([
        {type: 3, name: 'map2', description: 'Map 2', required: true},
        {type: 3, name: 'difficulty2', description: 'Difficulty', required: true},
        {type: 4, name: 'attempts2', description: 'Number of Attempts', required: true}
    ])
    ,
    map3 = map2.concat([
        {type: 3, name: 'map3', description: 'Map 3', required: true},
        {type: 3, name: 'difficulty3', description: 'Difficulty', required: true},
        {type: 4, name: 'attempts3', description: 'Number of Attempts', required: true}
    ]),
    map4 = map3.concat([
        {type: 3, name: 'map4', description: 'Map 4', required: true},
        {type: 3, name: 'difficulty4', description: 'Difficulty', required: true},
        {type: 4, name: 'attempts4', description: 'Number of Attempts', required: true}
    ])



module.exports = {
    name: 'calculate-score',
    description: 'Calculates score. Use 0 attempts to represent a failed map',
    options: [
        {type: 1, name: 'one-map', description: 'Calculate score for one map.', options: map1},
        {type: 1, name: 'two-maps', description: 'Calculate score for two maps.', options: map2},
        {type: 1, name: 'three-maps', description: 'Calculate score for three maps.', options: map3},
        {type: 1, name: 'four-maps', description: 'Calculate score for four maps.', options: map4}
    ],
    /**
     * Gets the scores using score.js and reports the score or an error
     * @param interaction
     *      interaction is a discord.js Interaction object
     */
    callback: interaction => {
        ScoreHandler.score_handler(interaction.options.map(_ => {
            return {name: _.name, options: _.options}
        })[0]).then(field_info => {
            interaction.reply({embeds: [
                new Discord.MessageEmbed()
                    .setTitle('Score')
                    .setFooter('Be more specific if the map name or difficulty is incorrect')
                    .setColor('NAVY')
                    .addFields(create_fields(field_info))
                ]}
            )
        }).catch(err => {
            interaction.reply({embeds: [
                new Discord.MessageEmbed()
                    .setTitle(x + x + ' Score Calculation Failed ' + x + x)
                    .setFooter('Try Again')
                    .addField('Reason', 'Error: ' + err)
                    .setThumbnail(defeat_url)
                    .setColor('RED')
                ]}
            )
        })
    }
}

/**
 * Format the fields for the embed in the case that there is no error
 * @param result
 * @returns {[{name: string, value: *}]}
 */
function create_fields(result){
    const [maps, diffs, attempts, score] = result
    const adjusted_attempts = attempts.map(_ => _ === '0' ? 'Map Failed' : _)

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
