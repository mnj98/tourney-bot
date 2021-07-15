/**
 * Start the timers for a specific timeslot with a specific amount of time
 *  and a specific offset for which the teams will no longer be allowed to
 *  start any new maps
 */

const timer = require('../src/timer.js')
const role = require('../src/check_role.js')
const Discord = require('discord.js')

const defeat_url = 'https://raw.githubusercontent.com/mnj98/tourney-bot/master/loss.png'
const x = ':x:'
const check = ':stopwatch:'
const rat = ':rat:'

module.exports = {
    slash: true,
    testOnly: true,
    name: 'start-timers',
    description: 'Starts tournament timers for a timeslot with a given time',
    minArgs: 3,
    expectedArgs: '<time slot> <minutes> <offset>',
    argTypes: [3, 4, 4],
    /**
     * @param input
     *      input contains fields [member, guild, channel, args, text, client, instance, interaction]
     *      which also contain sub-fields. Console log to see the full details
     * @returns {Promise<this|module:"discord.js".MessageEmbed>}
     */
    callback: async input => {
        //Ensure the user has the correct role
        if(!role.is_admin(input)) return role.respond()

        //When there are no errors start_timers resolves to nothing
        try {
            await timer.start_timers(input)
            return new Discord.MessageEmbed()
                .setTitle(check + check + ' Timers Started ' + check + check)
                .setFooter('Here we go!!')
                .addField('\u200b', rat, true)
                .addField('\u200b', rat, true)
                .addField('\u200b', rat, true)
                .setColor('GREEN')
        }
        //But if there is an error it rejects with that error
        catch(err){
            return new Discord.MessageEmbed()
                .setTitle(x + x + ' Timer Error ' + x + x)
                .setFooter('Try Again')
                .addField('Reason', err + '')
                .setThumbnail(defeat_url)
                .setColor('RED')
        }
    }
}
