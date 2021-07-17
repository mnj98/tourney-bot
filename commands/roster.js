/**
 * Sends the link to the roster document
 */

const Discord = require('discord.js')

const url = 'https://docs.google.com/spreadsheets/d/1SA0twJDK9mkc-zwIaSLfDIEfssxd7dMszWRfYwMKnzY/edit#gid=0'
const paper = ':newspaper:'

module.exports = {
    description: 'Provides link to roster',
    name: 'roster',
    callback: interaction => {
        interaction.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(paper + paper + ' Here\'s the Roster ' + paper + paper)
                    .setColor('ORANGE')
                    .addField('\u200b', '\u200b', true)
                    .addField('URL', url, true)
                    .addField('\u200b', '\u200b', true)]}
        )
    }
}
