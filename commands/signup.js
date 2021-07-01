const signup = require('../src/signup.js')
const Discord = require('discord.js')

const logo_url = 'https://raw.githubusercontent.com/mnj98/tourney-bot/master/logo.jpg'
const defeat_url = 'https://raw.githubusercontent.com/mnj98/tourney-bot/master/loss.png'
const check = ':white_check_mark:'

module.exports = {
    slash: true,
    testOnly: true,
    name: 'signup',
    description: 'Allows you to sign up for the tournament',
    minArgs: 6,
    maxArgs: 8,
    expectedArgs: '<team name> <tier> <player1> <player2> <player3> <player4> [sub1] [sub2]',
    argTypes: [3, 3, 9, 9, 9, 9, 9, 9],
    callback: async input => {
        if(input.interaction.channel_id !== global.signup_channel_id) return 'Please use the signup channel'
        try{
            let fields = get_fields(await signup.signup_handler(input.args, input.guild))

            return new Discord.MessageEmbed()
                .setTitle(check + check + ' Signup Successful ' + check + check)
                .setThumbnail(logo_url)
                .setFooter('Contact TOs if you want to change your timeslot or resign')
                .addFields(fields)
                .setColor('GREEN')
        }
        catch(err){
            return new Discord.MessageEmbed()
                .setTitle(':x::x: Signup Failed :x::x:')
                .setFooter('Try Again')
                .addField('Reason', err + '')
                .setThumbnail(defeat_url)
                .setColor('RED')
        }
    }
}

function get_fields(response){
    const [player_names, team_name, tier] = response
    let fields = [
        {
            name: 'Team',
            value: team_name,
            inline: true
        },
        {
            name: 'Tier',
            value: tier,
            inline: true
        }, {name: '\u200b', value: '\u200b', inline: true}]

    for(let i = 0; i < 2; i++){
        fields.push({
            name: 'Player ' + (i + 1),
            value: player_names[i],
            inline: true
        })
    }

    fields.push({name: '\u200b', value: '\u200b', inline: true})

    for(let i = 2; i < 4; i++){
        fields.push({
            name: 'Player ' + (i + 1),
            value: player_names[i],
            inline: true
        })
    }

    fields.push({name: '\u200b', value: '\u200b', inline: true})

    for(let i = 4; i < 6; i++){
        if(player_names[i]) fields.push({
            name: 'Sub ' + (i - 3),
            value: player_names[i],
            inline: true
        })
    }

    return fields
}
