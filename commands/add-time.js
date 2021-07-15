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
     * @param input
     *      input contains fields [member, guild, channel, args, text, client, instance, interaction]
     *      which also contain sub-fields. Console log to see the full details
     * @returns {Promise<this|module:"discord.js".MessageEmbed>}
     */
    callback: async input => {
        //Ensure correct permission
        if(!role.is_admin(input)) return role.respond()

        try {
            const response = await timer.update_time(input.args[0], input.args[1])

            return new Discord.MessageEmbed()
                .setTitle(clock + clock + ' Time Successfully Updated ' + clock + clock)
                .addField('Team', response.team, true)
                .addField('Amount', response.time + ' minutes', true)
                .addField('\u200b', '\u200b', true)
                .setColor('GREEN')
                .setFooter('Use /timer-info to see remaining times')
        }catch(err){
            return err_response(err)
        }
    }
}

/**
 * Formats the response in the event of an error
 * @param err
 * @returns {module:"discord.js".MessageEmbed}
 */
function err_response(err){
    return new Discord.MessageEmbed()
        .setTitle(face + face + ' Add Time Error ' + face + face)
        .addField('\u200b', shrug, true)
        .addField('Reason', err, true)
        .addField('\u200b', shrug, true)
        .setColor('RED')
}
