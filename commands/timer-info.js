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
    /**
     * Runs when a correctly formatted timer-info command is issued
     @param input
     *      input contains fields [member, guild, channel, args, text, client, instance, interaction]
     *      which also contain sub-fields. Console log to see the full details
     * @returns {Promise<string|module:"discord.js".MessageEmbed>}
     *
     * Uses timer.js to get the currently active timers and displays them as embed(s)
     */
    callback: async input => {
        //must be a specific role (TOs)
        if(!check_if.is_admin(input)) return 'You do not have permissions for this command'

        //If getting the timers goes well
        try{
            //Get timers, split into 2d array with rows of length max 16
                //embeds have a limit of 25 fields,
                //and with padding 16 is all I can get away with
            //then map that 2d array into 1d array of embeds
            const embeds = split_into_16s(await timer.get_timer_info(input.args[0])).map(teams => {
                return new Discord.MessageEmbed()
                    .setTitle(clock + clock + 'Tournament Clock Information' + clock + clock)
                    .setColor('YELLOW')
                    //map the array of teams into fields with padding
                    .addFields(get_fields(teams))
            })

            //Do different things based on the number of embeds
            switch (embeds.length){
                //No timer data
                case 0: {
                    return new Discord.MessageEmbed()
                        .setTitle(face + face + ' No Timers ' + face + face)
                        .setColor('LIGHT_GREY')
                        .addField('\u200b', ':person_shrugging:')
                }
                //Only 1 embed
                case 1: {
                    return embeds[0]
                }
                //More than 1 embed
                    //Just due to networking these embeds can appear in any order in the server
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
            value: (!team.has_completed ? (team.time_left + '') : 'is out of time'),
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
