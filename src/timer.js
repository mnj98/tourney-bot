/**
 * Handles timer functions
 */

const SheetService = require('./sheets.js')
const Stopwatch = require('./stopwatch.js')

module.exports = {start_timers, update_time, get_timer_info}

/**
 * Starts all timers on timeslot day with time minutes
 * @param day, the timeslot
 * @param time, number of minutes
 * @param client
 */
function start_timers(day, time, client){
    return new Promise((resolve, reject) => {
        //Team names and ids of teams with timeslot day
        get_teams_and_ids(day).then(teams => {
            //Create and start the timers
            //On event 'end' run time up
            teams.forEach(team => {
                new Stopwatch.Stopwatch(team[0].toLowerCase(), {seconds: time * 60}).on('end', () => time_up(team, client)).start()
            })
            resolve()
        }).catch(err => reject('Failure ' + err))
    })
}

/**
 * Change the time based on the input
 * @param team
 * @param time
 */
function update_time(team, time){
    const timer = Stopwatch.get(team.toLowerCase())
    let success
    if(timer){
        timer.seconds += (time * 60)
        success = true
    }
    else success = false
    return {team: team, time: time, success: success}
}

/**
 * Notifies a team when their time is up
 * @param team
 * @param client
 */
function time_up(team, client){
    client.channels.fetch(process.env.notification_channel_id).then(channel =>{
        let response = 'Team ' + team[0] + ', your time is up.'

        team[1].forEach(id => {
            response += ' <@' + id + '>'
        })
        channel.send(response)
    })
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
                const timer = Stopwatch.get(team.toLowerCase())
                
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
                teams.push([data[0][i][0], data[1][i][0], data[2][i]])
            }
            for(let i = 0; i < num_teams_t2; i++){
                teams.push([data[3][i][0], data[4][i][0], data[5][i]])
            }
            for(let i = 0; i < num_teams_t3; i++){
                teams.push([data[6][i][0], data[7][i][0], data[8][i]])
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
