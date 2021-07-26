/**
 * Allows you to update a team's time as it runs
 */

const timer = require('../timer.js')
const role = require('../check_role.js')
const Discord = require('discord.js')

const face = ':face_with_spiral_eyes:'
const clock = ':hourglass:'
const shrug = ':person_shrugging:'

module.exports = {
    name: 'add-time',
    description: 'Add time to a team\'s clock',
    options: [
        {type: 3, name: 'team', description: 'Team Name', required: true},
        {type: 4, name: 'minutes', description: 'Minutes', required: true}
    ],
    /**
     * Calls update time and sends response back to discord
     * @param interaction
     *      interaction is a discord.js Interaction object
     */
    callback: interaction => {
        //Ensure correct permission
        if(!role.is_admin(interaction)) interaction.reply({embeds: [role.respond()]})
        else{
            const [team, time] = interaction.options.map(_ => _.value + '')
            timer.update_time(team, time).then(response => {
                interaction.reply({
                    embeds: [new Discord.MessageEmbed()
                        .setTitle(clock + clock + ' Time Successfully Updated ' + clock + clock)
                        .addField('Team', response.team, true)
                        .addField('Amount', response.time + ' minutes', true)
                        .addField('\u200b', '\u200b', true)
                        .setColor('GREEN')
                        .setFooter('Use /timer-info to see remaining times')
                    ]}
                )
            }).catch(err => interaction.reply({embeds: [err_response(err)]}))
        }
    }
}

/**
 * Formats the response in the event of an error
 * @param err
 */
function err_response(err){
    return new Discord.MessageEmbed()
        .setTitle(face + face + ' Add Time Error ' + face + face)
        .addField('\u200b', shrug, true)
        .addField('Reason', '' + err, true)
        .addField('\u200b', shrug, true)
        .setColor('RED')
}
