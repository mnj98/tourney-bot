/**
 * Coordinate signup
 */

const signup = require('../signup.js')
const Discord = require('discord.js')
const fields = require('../fields.js')

const logo_url = 'https://raw.githubusercontent.com/mnj98/tourney-bot/master/logo.jpg'
const defeat_url = 'https://raw.githubusercontent.com/mnj98/tourney-bot/master/loss.png'
const check = ':white_check_mark:'
const x = ':x:'

module.exports = {
    name: 'signup',
    description: 'Allows you to sign up for the tournament',
    options: [
        {type: 3, name: 'team-name', description: 'Team Name', required: true},
        {type: 4, name: 'tier', description: 'Tier', required: true, choices: [
                {name: 'Tier 1', value: 1},
                {name: 'Tier 2', value: 2},
                {name: 'Tier 3', value: 3}
            ]
        },
        {type: 9, name: 'player1', description: 'Player 1', required: true},
        {type: 9, name: 'player2', description: 'Player 2', required: true},
        {type: 9, name: 'player3', description: 'Player 3', required: true},
        {type: 9, name: 'player4', description: 'Player 4', required: true},
        {type: 9, name: 'sub1', description: 'Sub 1'},
        {type: 9, name: 'sub2', description: 'Sub 2'}
    ],
    /**
     * Signup callback called when /signup is used with correct syntax
     * @param interaction
     *      interaction is a discord.js Interaction object
     *
     * This function basically uses signup.js to authenticate and complete a signup request.
     * If that request goes through then the team info is forwarded back as an embed.
     *
     */
    callback: interaction => {
        //Check if you are using the correct channel
        if(interaction.channelId !== process.env.SIGNUP_CHANNEL_ID)
            interaction.reply({content: 'Please use the signup channel'})
        else{
            signup.signup_handler(interaction).then(field_info => {
                interaction.reply({embeds: [
                    new Discord.MessageEmbed()
                        .setTitle(check + check + ' Signup Successful ' + check + check)
                        .setThumbnail(logo_url)
                        .setFooter('Contact TOs if you want to change your timeslot or resign')
                        //Use fields.js to format fields
                        .addFields(fields.get_fields(field_info))
                        .setColor('GREEN')
                    ]}
                )
            }).catch(err => {
                interaction.reply({embeds: [
                    new Discord.MessageEmbed()
                        .setTitle(x + x + ' Signup Failed ' + x + x)
                        .setFooter('Try Again')
                        .addField('Reason', '' + err)
                        .setThumbnail(defeat_url)
                        .setColor('RED')
                    ]}
                )
            })
        }
    }
}
