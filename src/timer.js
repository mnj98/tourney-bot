const SheetService = require('./sheets.js')
const Stopwatch = require('stopwatch')

module.exports = {start_timers, update_time, get_timer_info}

function start_timers(day, time, client){
    get_teams_and_ids(day).then(teams => {
        teams.forEach(team => {
            Stopwatch.get(team[0].toLowerCase(), {seconds: time * 60}).on('end', () => time_up(team, client)).start()
        })
    }).catch(err => handle_err(err, client))
}

function update_time(team, time){
    Stopwatch.get(team.toLowerCase(), {seconds: 3}).seconds += (time * 60)
}

function handle_err(err, client){
    client.channels.fetch(process.env.notification_channel_id).then(channel =>{
        channel.send('Failure: ' + err)
    })
}

function time_up(team, client){
    client.channels.fetch(process.env.notification_channel_id).then(channel =>{
        let response = 'Team ' + team[0] + ', your time is up.'

        team[1].forEach(id => {
            response += ' <@' + id + '>'
        })
        channel.send(response)
    })
}

function get_teams_and_ids(day){
    return new Promise((resolve, reject) =>{
        get_formatted_timer_data(day).then(data => {
            return resolve(data.map(team => [team[0], team[2]]))
        }).catch(reject)
    })
}

function get_timer_info(day){
    return new Promise((resolve, reject) => {
        get_teams(day).then(teams => {
            return resolve(teams.map(team => {
                const timer = Stopwatch.get(team, {seconds:3})

                const time = new Date(timer.seconds * 1000)
                    .toISOString().substr(11, 8).split(':')

                return {
                    name: team,
                    time_left: time[0] + 'h ' + time[1] + 'm ' + time[2] + 's ',
                    has_completed: !timer.started()
                }
            }))
        }).catch(reject)
    })

}

function get_teams(day){
    return new Promise((resolve, reject) =>{
        get_formatted_timer_data(day).then(data => {
            return resolve(data.map(team => team[0]))
        }).catch(reject)
    })
}

function get_formatted_timer_data(day){
    return new Promise((resolve, reject) => {
        SheetService.get_timer_data().then(data => {
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

            return resolve(teams.filter(team =>
                team[1].toLowerCase() === day.toLowerCase()
            ))
        }).catch(reject)
    })
}
