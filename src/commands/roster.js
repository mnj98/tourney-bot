/**
 * Sends the link to the roster document
 */

const Discord = require('discord.js')

const url = 'https://docs.google.com/spreadsheets/d/1Jx3Yc-n8fGy8vwv9NE2l9e6hLBKlLYW-ghmOByhb9FE/edit?usp=sharing'
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
                .addField('\u200b', '\u200b', true)
            ]}
        )
    }
}
