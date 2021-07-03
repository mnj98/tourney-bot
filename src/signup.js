const SheetService = require('./sheets.js')
module.exports = {signup_handler}

function signup_handler(args, guild) {
    return new Promise((resolve, reject) => {

        const team_name = args[0]

        SheetService.get_team_names().then(team_names =>{
            if(team_names.includes(team_name.toLowerCase())) return reject('Team name \"' + team_name + '\" is already in use')

            const tier = args[1].toLowerCase()
            if (tier !== 'tier1' && tier !== 'tier2' && tier !== 'tier3') return reject('Invalid Tier')

            const player_ids = args.slice(2)
            const duplicates = get_duplicate_ids(player_ids)
            if(duplicates.length > 0) return reject(notify_duplicates(duplicates))

            get_names(player_ids, guild).then(names => {
                SheetService.get_num_signed_up(player_ids).then(player_counts => {

                    const conflicts = determine_conflicts(player_counts, player_ids)
                    if(conflicts.length > 0) return reject(notify_conflicts(conflicts))

                    SheetService.append_line(tier, get_line(team_name, names, player_ids)).then(() => {
                        return resolve([player_ids.map(id => '<@' + id + '>'), team_name, tier])
                    }).catch(reject)
                }).catch(reject)
            }).catch(reject)
        }).catch(reject)


    })
}

function get_line(team_name, names, player_ids){
    return [['', team_name,
            names[0], names[1], names[2], names[3],
            names[4] ? names[4] : '', names[5] ? names[5] : '',
            '', '', player_ids[0], player_ids[1], player_ids[2],
            player_ids[3], player_ids[4] ? player_ids[4] : '',
            player_ids[5] ? player_ids[5] : '']]
}

function notify_duplicates(ids){
    let reply = 'Sorry but'
    ids.forEach(id => {
        reply = reply + ' ' + id
    })
    return reply + ' can\'t be on the same team twice.'
}

function notify_conflicts(ids){
    let reply = 'Sorry but'
    ids.forEach(id => {
        reply = reply + ' ' + id
    })
    return reply + (ids.length > 1 ? ' are' : ' is') + ' already on a team.'
}

function determine_conflicts(conflict_counts, player_ids){
    let already_signed_up = []
    for(let i = 0; i < conflict_counts.length; i++){
        if(conflict_counts[i] > 0 && player_ids[i]) already_signed_up.push('<@' + player_ids[i] + '>')
    }
    return already_signed_up
}

function get_names(ids, guild){
    return new Promise((resolve, reject) => {
        guild.members.fetch({user: ids}).then(players => {
            resolve(players.map(player => {
                return player.nickname ? player.nickname : player.user.username}))
        }).catch(reject)
    })
}

/*
function get_names(ids, guild){
    return new Promise((resolve, reject) => {
        Promise.all(ids.map(id => guild.members.fetch(id))).then(players => {
            resolve(players.map(player => {
                return player.nickname ? player.nickname : player.user.username}))
        }).catch(err => reject(err))
    })
}*/

function get_duplicate_ids(ids){
    const no_duplicates = [...new Set(ids)]
    let duplicates = [...ids]
    no_duplicates.forEach((item) => {
        const i = duplicates.indexOf(item)
        duplicates = duplicates.slice(0, i).concat(duplicates.slice(i + 1, duplicates.length))
    })
    return Array.from(new Set(duplicates)).map(id => id ? '<@' + id + '>' : '').filter(id => id)
}
