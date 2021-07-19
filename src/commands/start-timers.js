/**
 * Start the timers for a specific timeslot with a specific amount of time
 *  and a specific offset for which the teams will no longer be allowed to
 *  start any new maps
 */

const timer = require('../timer.js')
const role = require('../check_role.js')
const Discord = require('discord.js')

const defeat_url = 'https://raw.githubusercontent.com/mnj98/tourney-bot/master/loss.png'
const x = ':x:'
const check = ':stopwatch:'
const rat = ':rat:'

module.exports = {
    name: 'start-timers',
    description: 'Starts tournament timers for a timeslot with a given time',
    options: [
        {type: 3, name: 'time-slot', description: 'Time Slot', required: true},
        {type: 4, name: 'minutes', description: 'Minutes', required: true},
        {type: 4, name: 'offset', description: 'Offset', required: true}
    ],
    /**
     * @param interaction
     *      interaction is a discord.js Interaction object
     */
    callback: async interaction => {
        //Ensure the user has the correct role
        if(!role.is_admin(interaction)) return interaction.reply({embeds: [role.respond()]})

        //When there are no errors start_timers resolves to nothing
        try {
            await timer.start_timers(interaction)

            interaction.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(check + check + ' Timers Started ' + check + check)
                .setFooter('Here we go!!')
                .addField('\u200b', rat, true)
                .addField('\u200b', rat, true)
                .addField('\u200b', rat, true)
                .setColor('GREEN')]}
            )
        }
        //But if there is an error it rejects with that error
        catch(err){
            interaction.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(x + x + ' Timer Error ' + x + x)
                .setFooter('Try Again')
                .addField('Reason', err + '')
                .setThumbnail(defeat_url)
                .setColor('RED')]}
            )
        }
    }
}
