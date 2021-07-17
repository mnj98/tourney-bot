/**
 * Allows you to update a team's time as it runs
 */

const timer = require('../src/timer.js')
const role = require('../src/check_role.js')
const Discord = require('discord.js')

const face = ':face_with_spiral_eyes:'
const clock = ':hourglass:'
const shrug = ':person_shrugging:'

module.exports = {
    slash: true,
    testOnly: true,
    name: 'add-time',
    description: 'Add time to a team\'s clock',
    minArgs: 2,
    expectedArgs: '<team> <minutes>',
    argTypes: [3, 4],
    /**
     * Calls update time and sends response back to discord
     * @param interaction
     *      interaction is a discord.js Interaction object
     */
    callback: async interaction => {
        //Ensure correct permission
        if(!role.is_admin(interaction)) return interaction.reply({embeds: [role.respond()]})

        const [team, time] = interaction.options.map(_ => _.value + '')

        try {
            const response = await timer.update_time(team, time)

            interaction.reply({embeds: [new Discord.MessageEmbed()
                        .setTitle(clock + clock + ' Time Successfully Updated ' + clock + clock)
                        .addField('Team', response.team, true)
                        .addField('Amount', response.time + ' minutes', true)
                        .addField('\u200b', '\u200b', true)
                        .setColor('GREEN')
                        .setFooter('Use /timer-info to see remaining times')]}
            )
        }catch(err){
            interaction.reply({embeds: [err_response(err)]})
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
        .addField('Reason', err, true)
        .addField('\u200b', shrug, true)
        .setColor('RED')
}
