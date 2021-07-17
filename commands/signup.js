/**
 * Coordinate signup
 */

const signup = require('../src/signup.js')
const Discord = require('discord.js')
const fields = require('../src/fields.js')

const logo_url = 'https://raw.githubusercontent.com/mnj98/tourney-bot/master/logo.jpg'
const defeat_url = 'https://raw.githubusercontent.com/mnj98/tourney-bot/master/loss.png'
const check = ':white_check_mark:'
const x = ':x:'

module.exports = {
    slash: true,
    testOnly: true,
    name: 'signup',
    description: 'Allows you to sign up for the tournament',
    minArgs: 6,
    maxArgs: 8,
    expectedArgs: '<team name> <tier> <player1> <player2> <player3> <player4> [sub1] [sub2]',
    argTypes: [3, 3, 9, 9, 9, 9, 9, 9],

    /**
     * Signup callback called when /signup is used with correct syntax
     * @param interaction
     *      interaction is a discord.js Interaction object
     *
     * This function basically uses signup.js to authenticate and complete a signup request.
     * If that request goes through then the team info is forwarded back as an embed.
     *
     */
    callback: async interaction => {
        //Check if you are using the correct channel
        if(interaction.channelId !== process.env.signup_channel_id)
            return interaction.reply({content: 'Please use the signup channel'})

        //If there are no errors with signup
        try{
            interaction.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(check + check + ' Signup Successful ' + check + check)
                .setThumbnail(logo_url)
                .setFooter('Contact TOs if you want to change your timeslot or resign')
                //Use fields.js to format fields
                .addFields(fields.get_fields(await signup.signup_handler(interaction)))
                .setColor('GREEN')]}
            )
        }
        //send error embed
        catch(err){
            interaction.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(x + x + ' Signup Failed ' + x + x)
                .setFooter('Try Again')
                .addField('Reason', err + '')
                .setThumbnail(defeat_url)
                .setColor('RED')]}
            )
        }
    }
}
