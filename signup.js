const SheetService = require('./sheets.js')
module.exports = {signup_handler}

async function signup_handler(words, msg, client, apiKey, auth, sheets, spreadsheetId) {
    if (words.length <= 6 || words.length > 9) bad_signup(msg, 'syntax')
    else {


        words.push('')
        words.push('')

        let player_ids = get_player_ids(words, msg)
        if (player_ids.length === 0) return

	    console.log(player_ids)

        get_conflicts(player_ids, msg, spreadsheetId, auth, apiKey, sheets).then(conflict_counts => {
            console.log('conflict_counts: ' + conflict_counts)

            const conflicts = determine_conflicts(conflict_counts, player_ids)

            if(conflicts.length > 0){
                notify_conflicts(conflicts, msg)
                //return
            }

            get_names(player_ids, msg, client).then(names => {
                let tier = words[2].toLowerCase()
                if (tier === 'tier1' || tier === 'tier2' || tier === 'tier3') {
                    const line = [
                        ['', words[1], names[0], names[1], names[2], names[3], names[4], names[5],
                            '', '', player_ids[0], player_ids[1], player_ids[2], player_ids[3], player_ids[4], player_ids[5]]
                    ]
                    SheetService.append_line(msg, tier, line, spreadsheetId, auth, apiKey, sheets)
                } else bad_signup(msg, 'tier')
            })
        })
    }
}

function notify_conflicts(ids, msg){
    let reply = 'Sorry but'
    ids.forEach(id => {
        reply = reply + ' ' + id
    })
    msg.reply(reply + (ids.length > 1 ? ' is' : ' are') + ' already on a team. (We can ignore that since the bot is in development :) )')
}

function determine_conflicts(conflict_counts, player_ids){
    let already_signed_up = []
    for(let i = 0; i < conflict_counts.length; i++){
        console.log('conf count ' + conflict_counts[i])
        if(conflict_counts[i] > 0 && player_ids[i]) already_signed_up.push('<@!' + player_ids[i] + '>')
    }
    return already_signed_up
}

function get_conflicts(player_ids, msg, spreadsheetId, auth, apiKey, sheets){
    return Promise.all(player_ids.map(id => {
        return SheetService.get_if_signed_up(id, msg, spreadsheetId, auth, apiKey, sheets)
    }))
}


async function get_names(ids, msg, client){
    let names = []
    console.log('ids: ' + ids)
    for (const id of ids) {
        console.log('id: ' + id)
        if(id === '') names.push('')
        else{
            const member = await msg.guild.member(id)
            names.push(member ? member.nickname : id)
        }
    }
    return names
}

function get_player_ids(words, msg){
    let ids = []


    for(let i = 0; i < 4; i++) {
        let player = words[3 + i].match(/<@![\d]*>/g)
        if (player == null || player.length !== 1) {
            msg.reply('Unknown player: ' + words[3 + i])
            return []
        }
        else{
            ids.push(player[0].match(/\d+/g)[0])
        }

    }

    if(words[7] === '') ids.push('')
    else{
        let player =words[7].match(/<@![\d]*>/g)
        if (player == null || player.length !== 1) {
            msg.reply('Unknown player: ' + words[7])
            return []
        }
        else{
            ids.push(player[0].match(/\d+/g)[0])
        }
    }
    if(words[8] === '') ids.push('')
    else{
        let player =words[8].match(/<@![\d]*>/g)
        if (player == null || player.length !== 1) {
            msg.reply('Unknown player: ' + words[8])
            return []
        }
        else{
            ids.push(player[0].match(/\d+/g)[0])
        }
    }

    return ids
}



function bad_signup(msg, reason){
    msg.reply('Incorrect ' + reason + ',\nuse: !signup \"team name\" TierX player1 player2 player3 player4')
}
