const signup = require('../src/signup.js')
const Discord = require('discord.js')

const logo_url = 'https://cdn.discordapp.com/icons/567836553192144953/0e1ec53afc4e455fec638418461b4bb6.png'
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
            const [player_names, team_name] = await signup.signup_handler(input.args, input.guild)
            let fields = [{
                name: 'Team',
                value: team_name
            }]
            for(let i = 0; i < 4; i++){
                fields.push({
                    name: 'Player ' + (i + 1),
                    value: player_names[i],
                    inline: true,

                })
            }
            for(let i = 0; i < 6; i++){
                fields.push({
                    name: 'crap ' + i,
                    value: 'pee ' + i,
                    inline: true,

                })
            }
            for(let i = 4; i < 6; i++){
                if(player_names[i]) fields.push({
                    name: 'Sub ' + (i - 3),
                    value: player_names[i]
                })
            }

            return new Discord.MessageEmbed()
                .setTitle(check + check + ' Signup Successful ' + check + check)
                .setImage(logo_url)
                .setFooter('Contact TOs if you want to change your timeslot or resign TTTTTTTTTTTTTTTTTTTTTTTTT')
                .addFields(fields)
                .setColor('GREEN')
        }
        catch(err){
            return 'Signup failed: ' + err
        }
    }
}
