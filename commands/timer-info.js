const timer = require('../src/timer.js')
const check_if = require('../src/check_role.js');
const Discord = require('discord.js')

const face = ':face_with_spiral_eyes:'
const clock = ':hourglass:'

module.exports = {
    slash: true,
    testOnly: true,
    name: 'timer-info',
    description: 'Gets info about running timers',
    minArgs: 1,
    expectedArgs: '<time slot>',
    argTypes: [3],
    callback: async (input) => {
        if(!check_if.is_admin(input)) return 'You do not have permissions for this command'

        try{
            const embeds = split_into_25s(await timer.get_timer_info(input.args[0])).map(teams => {
                return new Discord.MessageEmbed()
                    .setTitle(clock + clock + 'Tournament Clock Information' + clock + clock)
                    .setColor('YELLOW')
                    .addFields(get_fields(teams))
            })

            switch (embeds.length){
                case 0: {
                    return new Discord.MessageEmbed()
                        .setTitle(face + face + ' No Timers ' + face + face)
                        .setColor('LIGHT_GREY')
                        .addField('\u200b', ':person_shrugging:')
                }
                case 1: {
                    return embeds[0]
                }
                default: {
                    for(let i = 0; i < embeds.length - 1; i++){
                        input.channel.send(embeds[i])
                    }
                    return embeds[embeds.length - 1]
                }
            }
        }catch(err){
            return 'Error :(  ' + err
        }
    }
}

function get_fields(teams){
    return teams.map(team => {
        return {
            name: team.name,
            value: (!team.has_completed ? ('**' + team.time_left + '**left') : '**run out of time**')
        }
    })
}

function split_into_25s(timers){
    let arr = []
    let tmp = timers

    for(let i = 0; i < timers.length; i += 25){
        arr.push(tmp.slice(0, 25))
        tmp = tmp.slice(25)
    }
    return arr
}
