/**
 * Clears all running timers
 */

const role = require('../src/check_role.js');
const stopwatch = require('../src/stopwatch')
const Discord = require('discord.js')

const clock = ':hourglass:'
const check = ':white_check_mark:'

module.exports = {
    slash: true,
    testOnly: true,
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
