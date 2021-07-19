/**
 * Clears all running timers
 */

const role = require('../check_role.js')
const stopwatch = require('../stopwatch')
const Discord = require('discord.js')

const clock = ':hourglass:'
const check = ':white_check_mark:'

module.exports = {
    name: 'clear-all-timers',
    description: 'Clears all timers',
    /**
     * @param interaction
     *      interaction is a discord.js Interaction object
     */
    callback: interaction => {
        //Ensures correct permissions
        if(!role.is_admin(interaction)) return interaction.reply({embeds: [role.respond()]})

        stopwatch.clear_watches()
        interaction.reply({embeds: [new Discord.MessageEmbed()
            .setTitle(clock + clock + ' All Timers Cleared ' + clock + clock)
            .setColor('GREEN')
            .addField('\u200b', check, true)
            .addField('\u200b', check, true)
            .addField('\u200b', check, true)]}
        )
    }
}
