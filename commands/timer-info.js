const timer = require('../src/timer.js')
const check_if = require('../src/check_role.js');
const Discord = require('discord.js')


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

        console.log(input)

        try{
            const embeds = split_into_25s(await timer.get_timer_info(input.args[0])).map(teams => {
                return new Discord.MessageEmbed()
                    .setTitle(':hourglass::hourglass: ' + 'Tournament Clock Information' + ':hourglass::hourglass: ')
                    .setColor('YELLOW')
                    .addFields(get_fields(teams))
            })

            return 't'
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
