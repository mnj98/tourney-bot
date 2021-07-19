/**
 * Handles timer functions
 */

const SheetService = require('./sheets.js')
const Stopwatch = require('./stopwatch.js')
const Similarity = require('string-similarity')
const Discord = require('discord.js')
const fields = require('./fields.js')

const clock = ':alarm_clock:'

module.exports = {start_timers, update_time, get_timer_info}

/**
 * Starts all timers on timeslot day with time minutes
 * @param day, the timeslot
 * @param time, number of minutes
 * @param client
 */
function start_timers(input){
    const [day, time, offset] = input.options.map(_ => _.value + '')

    return new Promise((resolve, reject) => {
        //the + makes offset a number so that the comparison is made between numbers instead of strings
        if(+offset >= time) return reject('Offset: ' + offset + ' too large for time: ' + time)
        //Team names and ids of teams with timeslot day
        get_teams_and_ids(day).then(teams => {
            //Create and start the timers
            //On event 'end' run time up
            if(teams.length === 0) reject('No teams scheduled for \'' + day + '\'')
            else {
                //For each team start a timer with the time_up as callback
                teams.forEach(team => {
                    new Stopwatch.Stopwatch(
                        team[0],
                        {seconds: (time - offset) * 60})
                        .on('end', () => time_up(team, input.member.guild))
                        .start()
                })
                resolve()
            }
        }).catch(err => reject('Failure ' + err))
    })
}

/**
 * Change the time based on the input
 * @param team
 * @param time
 */
function update_time(team, time){
    return new Promise((resolve, reject) => {

        //Get list of teams
        get_teams().then(team_names => {

            //Use string similarity to determine the true name of the team
                //This is so you don't have to spell the name correctly
            const closest_team = Similarity.findBestMatch(team, team_names).bestMatch

            //Arbitrary threshold for similarity is 0.2, most matches are > 0.5
            if(closest_team.rating < 0.2) reject('Unknown team name: ' + team)
            else {
                const timer = Stopwatch.get(closest_team.target)
                if (timer) {
                    timer.seconds += (time * 60)
                    resolve({team: closest_team.target, time: time})
                } else reject('No timer for team: ' + closest_team.target)
            }
        }).catch(reject)
    })
}

/**
 * Notifies a team when their time is up
 * @param team
 * @param client
 */
function time_up(team, guild){
    guild.channels.fetch(process.env.notification_channel_id).then(channel =>{
        let response = 'Team ' + team[0] + ', your time is up.'
        team[1].forEach(id => {
            response += ' <@' + id + '>'
        })
        channel.send({embeds: [time_up_embed(team)]})
        channel.send({content: response})
    })
}

/**
 * Format and return the embed for when the timer has completed
 * @param team
 * @returns {module:"discord.js".MessageEmbed}
 */
function time_up_embed(team){
    return new Discord.MessageEmbed()
        .setTitle(clock + clock +' Time Up ' + clock + clock)
        .setColor('DARK_AQUA')
        .setFooter('Do not start any more runs')
        .addFields(
            fields.get_fields([
                team[1].map(id => '<@' + id + '>'),
                team[0],
                null
            ]))
}

/**
 * Pull team name and ids out of formatted timer data
 * @param day
 * @returns {Promise<unknown>}
 */
function get_teams_and_ids(day){
    return new Promise((resolve, reject) =>{
        get_formatted_timer_data_by_day(day).then(data => {
            return resolve(data.map(team => [team[0], team[2]]))
        }).catch(reject)
    })
}

/**
 * Gets timer info
 * @returns {Promise<unknown>}
 */
function get_timer_info(){
    return new Promise((resolve, reject) => {
        get_teams().then(teams => {
            //With team names from day timeslot make an array of objects
            //with fields [name, time_left, has_completed]
            return resolve(teams.map(team => {
                const timer = Stopwatch.get(team)
                
                if(timer){
                    const time = new Date(timer.seconds * 1000)
                    .toISOString().substr(11, 8).split(':')

                    return {
                        name: team,
                        time_left: time[0] + 'h ' + time[1] + 'm ' + time[2] + 's ',
                        has_completed: timer.completed
                    }
                }
                //returns undefined
                else return timer
            //filter out undefined
            }).filter(_ => _))
        }).catch(reject)
    })
}

/**
 * Gets team info from formatted data
 * @param day
 * @returns {Promise<unknown>}
 */
function get_teams(){
    return new Promise((resolve, reject) =>{
        get_formatted_timer_data().then(data => {
            return resolve(data.map(_ => _[0]))
        }).catch(reject)
    })
}

/**
 * Helper function that formats info from sheets.js
 * @returns {Promise<unknown>}
 */
function get_formatted_timer_data(){
    return new Promise((resolve, reject) => {
        SheetService.get_timer_data().then(data => {

            //data is formatted as a 3d array
            //First 3 are tier 1
            //Second 3 are tier2
            //Third 3 are tier3

            //This code basically just flattens all that correctly
            const num_teams_t1 = data[0] ? data[0].length : 0
            const num_teams_t2 = data[3] ? data[3].length : 0
            const num_teams_t3 = data[6] ? data[6].length : 0

            let teams = []

            for(let i = 0; i < num_teams_t1; i++){
                teams.push([data[0][i][0], data[1] ? data[1][i][0] : 'default', data[2][i]])
            }
            for(let i = 0; i < num_teams_t2; i++){
                teams.push([data[3][i][0], data[4] ? data[4][i][0] : 'default', data[5][i]])
            }
            for(let i = 0; i < num_teams_t3; i++){
                teams.push([data[6][i][0], data[7] ? data[7][i][0] : 'default', data[8][i]])
            }

            return resolve(teams)
        }).catch(reject)
    })
}

/**
 * Uses sheets.js to get the info needed for timers
 * Then formats it from the weird way it is returned from google sheets
 * @param day
 * @returns {Promise<unknown>} an array of teams from day timeslot
 */
function get_formatted_timer_data_by_day(day){
    return new Promise((resolve, reject) => {
        get_formatted_timer_data().then(teams => {
            resolve(teams.filter(team =>
                team[1].toLowerCase() === day.toLowerCase()
            ))
        }).catch(reject)
    })
}
