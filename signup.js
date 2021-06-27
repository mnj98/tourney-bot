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

        get_conflicts(player_ids, msg, spreadsheetId, auth, apiKey, sheets).then(already_signed_up => {
            console.log('already signed up: ' + already_signed_up)

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

async function get_conflicts(player_ids, msg, spreadsheetId, auth, apiKey, sheets){
    let conflicts = []
    for(const id of player_ids){
        SheetService.get_if_signed_up(id, msg, spreadsheetId, auth, apiKey, sheets).then(already_signed_up =>{
            if(already_signed_up != 0){
                console.log(id + ' has already signed up with count: ' + already_signed_up)
                conflicts.push(id)
            }
        })

    }
    return conflicts
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
