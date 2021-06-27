module.exports = {signup_handler}

async function signup_handler(words, msg, client, apiKey, auth, sheets, spreadsheetId) {
    if (words.length <= 6 || words.length > 9) bad_signup(msg, 'syntax')
    else {


        words.push('')
        words.push('')

        let player_ids = get_player_ids(words, msg)
        if (player_ids.length === 0) return

	console.log(player_ids)

        let names = await get_names(player_ids, msg, client)


        let tier = words[2].toLowerCase()
        if (tier === 'tier1' || tier === 'tier2' || tier === 'tier3') {

            sheets.spreadsheets.values.append({
                spreadsheetId: spreadsheetId,
                auth: auth,
                key: apiKey,
                range: tier + '!A:P',
                valueInputOption: 'USER_ENTERED',
                resource: {
                    values: [
                        ['', words[1], player_ids[0], player_ids[1], player_ids[2], player_ids[3], player_ids[4], player_ids[5],
                            '', '', names[0], names[1], names[2], names[3], names[4], names[5]]
                    ]
                }
            }, (err, res) => {
                if (err) {
                    bad_signup(msg, 'backend error')
                }
                msg.reply('Signed up!')
            })

        } else bad_signup(msg, 'tier')


    }
}

async function get_names(ids, msg, client){
    let names = []
    console.log('ids: ' + ids)
    ids.forEach(id => {
        console.log('id: ' + id)
        if(id === '') names.push('')
        else{
            names.push((await client.users.fetch(id)).username)
        }
    })
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
            ids.push(player[0].match(/\d+/g))
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
            ids.push(player[0].match(/\d+/g))
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
            ids.push(player[0].match(/\d+/g))
        }
    }

    return ids
}



function bad_signup(msg, reason){
    msg.reply('Incorrect ' + reason + ',\nuse: !signup \"team name\" TierX player1 player2 player3 player4')
}
