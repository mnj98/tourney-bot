/**
 * Gets info on all the running timers
 */

const timer = require('../timer.js')
const role = require('../check_role.js')
const Discord = require('discord.js')

const face = ':face_with_spiral_eyes:'
const clock = ':hourglass:'
const shrug = ':person_shrugging:'

module.exports = {
    name: 'timer-info',
    description: 'Gets info about running timers',
    /**
     * Runs when a correctly formatted timer-info command is issued
     * @param interaction
     *      interaction is a discord.js Interaction object
     *
     * Uses timer.js to get the currently active timers and displays them as embed(s)
     */
    callback: interaction => {
        //must be a specific role (TOs)
        if(!role.is_admin(interaction)) interaction.reply({embeds: [role.respond()]})
        else{
            timer.get_timer_info().then(info => {
                //Get timers, split into 2d array with rows of length max 16
                //embeds have a limit of 25 fields,
                //and with padding 16 is all I can get away with
                //then map that 2d array into 1d array of embeds
                const embeds = split_into_16s(info).map(teams => {
                    return new Discord.MessageEmbed()
                        .setTitle(clock + clock + 'Tournament Clock Information' + clock + clock)
                        .setColor('YELLOW')
                        //map the array of teams into fields with padding
                        .addFields(get_fields(teams))
                })
                //no timers
                if(embeds.length === 0)
                    interaction.reply({embeds: [
                        new Discord.MessageEmbed()
                            .setTitle(face + face + ' No Timers ' + face + face)
                            .setColor('LIGHT_GREY')
                            .addFields([{name:'\u200b', value:':person_shrugging:', inline: true},
                                {name:'\u200b', value: shrug, inline: true},
                                {name:'\u200b', value: shrug, inline: true}])
                        ]}
                    )
                //timers sent
                else interaction.reply({embeds: embeds})
                //TODO: make this an embed, possibly create handler file to reduce duplicate code
            }).catch(err => interaction.reply({content: 'Error :(  ' + err}))
        }
    }
}

/**
 * Maps team timer info into fields
 * @param teams contains fields [name, has_complted, timer_left]
 * @returns {*} array of embed fields
 */
function get_fields(teams){
    //map teams into fields and add spaces
    return add_spaces(teams.map(team => {
        return {
            name: team.name,
            value: (!team.has_completed ? (team.time_left + '') : '**is out of time**'),
            inline: true
        }
    }))
}

/**
 * Add correct padding to an array of fields
 * @param array
 * @returns {*} array of embed fields
 */
function add_spaces(array){
    let pos = 2, interval = 3

    while(pos < array.length){
        array.splice(
            pos,
            0,
            {name: '\u200b', value: '\u200b', inline: true}
        )
        pos += interval
    }
    //one extra at the end
    array.push({name: '\u200b', value: '\u200b', inline: true})
    return array
}

/**
 * Splits a length n array into a 2d array with elements of length 16 (or less)
 * @param timers
 * @returns {[]}
 */
function split_into_16s(timers){
    let arr = []
    let tmp = timers
    let interval = 16

    for(let i = 0; i < timers.length; i += interval){
        arr.push(tmp.slice(0, interval))
        tmp = tmp.slice(interval)
    }
    return arr
}
