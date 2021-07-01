const SheetService = require('./sheets.js')
module.exports = {signup_handler}

async function signup_handler(args, guild) {
    return new Promise(resolve => {
        args.push('')
        args.push('')
        let player_ids = args.slice(2)


        const duplicates = get_duplicate_ids(player_ids)
        if(duplicates.length > 0) resolve(notify_duplicates(duplicates))

        SheetService.get_num_signed_up(player_ids.filter(id => id)).then(conflict_counts => {
            if(typeof conflict_counts === "string") resolve(conflict_counts)
            const conflicts = determine_conflicts(conflict_counts, player_ids)

            if(conflicts.length > 0) resolve(notify_conflicts(conflicts))

            get_names(player_ids, guild).then(names => {
                let tier = args[1].toLowerCase()
                if (tier === 'tier1' || tier === 'tier2' || tier === 'tier3') {
                    const line = [
                        ['', args[0], names[0], names[1], names[2], names[3], names[4], names[5],
                            '', '', player_ids[0], player_ids[1], player_ids[2], player_ids[3], player_ids[4], player_ids[5]]
                    ]
                    SheetService.append_line(tier, line).then(msg => resolve(msg))
                } else resolve(bad_signup('tier'))
            })
        })

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

async function get_names(ids, guild){
    let names = []
    for (const id of ids) {
        if(id === '') names.push('')
        else{

            const player = await guild.members.fetch(id)
            names.push(player.nickname ? player.nickname : player.user.username)
        }
    }
    return names
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
