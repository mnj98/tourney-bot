const SheetService = require('./sheets.js')
module.exports = {signup_handler}

function signup_handler(args, guild) {
    return new Promise((resolve, reject) => {
        const tier = args[1].toLowerCase()
        if (tier !== 'tier1' || tier !== 'tier2' || tier !== 'tier3') reject(bad_signup('tier'))
        let player_ids = args.slice(2)

        const duplicates = get_duplicate_ids(player_ids)
        if(duplicates.length > 0) reject(notify_duplicates(duplicates))

        get_names(player_ids, guild).then(names => {
            SheetService.get_num_signed_up(player_ids).then(player_counts => {
                const conflicts = determine_conflicts(player_counts, player_ids)
                if(conflicts.length > 0) reject(notify_conflicts(conflicts))

                SheetService.append_line(tier, [
                    ['', args[0],
                        names[0], names[1], names[2], names[3],
                        names[4] ? names[4] : '', names[5] ? names[5] : '',
                        '', '', player_ids[0], player_ids[1], player_ids[2],
                        player_ids[3], player_ids[4] ? player_ids[4] : '',
                        player_ids[5] ? player_ids[5] : ''
                    ]
                ]).then(msg => resolve(msg)).catch(err => reject(err))
            }).catch(err => reject(err))
        }).catch(err => reject(err))
    })
}

function notify_duplicates(ids){
    let reply = 'Sorry but'
    ids.forEach(id => {
        reply = reply + ' ' + id
    })
    return reply + ' can\'t be on the same team twice. (We can ignore that since the bot is in development :) )'
}

function notify_conflicts(ids){
    let reply = 'Sorry but'
    ids.forEach(id => {
        reply = reply + ' ' + id
    })
    return reply + (ids.length > 1 ? ' are' : ' is') + ' already on a team.)'
}

function determine_conflicts(conflict_counts, player_ids){
    let already_signed_up = []
    for(let i = 0; i < conflict_counts.length; i++){
        if(conflict_counts[i] > 0 && player_ids[i]) already_signed_up.push('<@!' + player_ids[i] + '>')
    }
    return already_signed_up
}

function get_names(ids, guild){
    return new Promise((resolve, reject) => {
        Promise.all(ids.map(id => guild.members.fetch(id))).then(players => {
            resolve(players.map(player => {
                return player.nickname ? player.nickname : player.user.username}))
        }).catch(err => reject(err))
    })
}

function get_duplicate_ids(ids){
    const no_duplicates = [...new Set(ids)]
    let duplicates = [...ids]
    no_duplicates.forEach((item) => {
        const i = duplicates.indexOf(item)
        duplicates = duplicates.slice(0, i).concat(duplicates.slice(i + 1, duplicates.length))
    })
    return Array.from(new Set(duplicates)).map(id => id ? '<@!' + id + '>' : '').filter(id => id)
}

function bad_signup(reason){
    return 'Incorrect ' + reason + ',\nuse: !signup \"team name\" TierX player1 player2 player3 player4'
}
