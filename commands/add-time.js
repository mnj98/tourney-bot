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
    callback: input => {
        if(!role.is_admin(input)) return role.respond()
        const response =  timer.update_time(input.args[0], input.args[1])

        return response.success ? (
            new Discord.MessageEmbed()
                .setTitle(clock + clock + ' Time Successfully Updated ' + clock + clock)
                .addField('Team', response.name, true)
                .addField('Amount', response.time + ' minutes', true)
                .addField('\u200b', '\u200b', true)
                .setColor('GREEN')
                .setFooter('Use /timer-info to see remaining times')
        ) : (
            new Discord.MessageEmbed()
                .setTitle(face + face + ' Unknown Team Name ' + face + face)
                .addField('\u200b', shrug, true)
                .addField('Team', response.team, true)
                .addField('\u200b', shrug, true)
                .setColor('RED')
        )
    }
}
