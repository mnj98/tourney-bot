/**
 * Sends the link to this code
 */

const Discord = require('discord.js')

const url = 'https://github.com/mnj98/tourney-bot'
const cpu = ':computer:'

module.exports = {
    slash: true,
    testOnly: true,
    description: 'Provides link to source code',
    name: 'source-code',
    callback: interaction => {
        interaction.reply({embeds: [new Discord.MessageEmbed()
            .setTitle(cpu + cpu + ' Here\'s the Source Code')
            .setColor('BLURPLE')
            .addField('\u200b', '\u200b', true)
            .addField('URL', url, true)
            .addField('\u200b', '\u200b', true)]}
        )
    }
}
