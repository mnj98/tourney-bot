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
    minArgs: 2,
    expectedArgs: '<time slot> <minutes>',
    argTypes: [3, 4],
    callback: async input => {
        if(!role.is_admin(input)) return role.respond()
        try {
            await timer.start_timers(input.args[0], input.args[1], input.client)
            return new Discord.MessageEmbed()
                .setTitle(check + check + ' Timers Started ' + check + check)
                .setFooter('Here we go!!')
                .addField('\u200b', rat, true)
                .addField('\u200b', rat, true)
                .addField('\u200b', rat, true)
                .setColor('GREEN')
        }
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
