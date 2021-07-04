const SheetService = require('./sheets.js')

module.exports = {get_formatted_timer_data}



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
            ).map(team => [team[0], team[2]]))
        }).catch(reject)
    })
}
