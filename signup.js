const SheetService = require('./sheets.js')
module.exports = {signup_handler}

async function signup_handler(words, msg) {
    if (words.length <= 6 || words.length > 9) bad_signup(msg, 'syntax')
    else {
        words.push('')
        words.push('')

        let player_ids = get_player_ids(words, msg)
        if (player_ids.length === 0) return

        const duplicates = get_duplicate_ids(player_ids)
        if(duplicates.length > 0){
            notify_duplicates(duplicates, msg)
            //Uncomment return for production
            //return
        }

        SheetService.get_num_signed_up(player_ids, msg).then(conflict_counts => {
            const conflicts = determine_conflicts(conflict_counts, player_ids)

            if(conflicts.length > 0){
                notify_conflicts(conflicts, msg)
                //Uncomment return for production
                //return
            }

            get_names(player_ids, msg).then(names => {
                let tier = words[2].toLowerCase()
                if (tier === 'tier1' || tier === 'tier2' || tier === 'tier3') {
                    const line = [
                        ['', words[1], names[0], names[1], names[2], names[3], names[4], names[5],
                            '', '', player_ids[0], player_ids[1], player_ids[2], player_ids[3], player_ids[4], player_ids[5]]
                    ]
                    SheetService.append_line(msg, tier, line)
                } else bad_signup(msg, 'tier')
            })
        })
    }
}

function notify_duplicates(ids, msg){
    let reply = 'Sorry but'
    ids.forEach(id => {
        reply = reply + ' ' + id
    })
    msg.reply(reply + ' can\'t be on the same team twice. (We can ignore that since the bot is in development :) )')
}

function notify_conflicts(ids, msg){
    let reply = 'Sorry but'
    ids.forEach(id => {
        reply = reply + ' ' + id
    })
    msg.reply(reply + (ids.length > 1 ? ' are' : ' is') + ' already on a team. (We can ignore that since the bot is in development :) )')
}

function determine_conflicts(conflict_counts, player_ids){
    let already_signed_up = []
    for(let i = 0; i < conflict_counts.length; i++){
        if(conflict_counts[i] > 0 && player_ids[i]) already_signed_up.push('<@!' + player_ids[i] + '>')
    }
    return already_signed_up
}

async function get_names(ids, msg){
    let names = []
    for (const id of ids) {
        if(id === '') names.push('')
        else{
            const member = await msg.guild.member(id)
            names.push(member.nickname ? member.nickname : member.user.username)
        }
    }
    return names
}

function get_player_ids(words, msg){
    let ids = []
    const id_str_regex = /<@!?\d+>/g
    const id_num_regex = /\d+/g

    for(let i = 0; i < 6; i++) {
        if(words[i + 3] || i < 4) {
            let player = words[i + 3].match(id_str_regex)
            if (player == null || player.length !== 1) {
                msg.reply('Unknown player: ' + words[i + 3])
                return []
            } else ids.push(player[0].match(id_num_regex)[0])

        }
        else ids.push('')
    }
    return ids
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

function bad_signup(msg, reason){
    msg.reply('Incorrect ' + reason + ',\nuse: !signup \"team name\" TierX player1 player2 player3 player4')
}
