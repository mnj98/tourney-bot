module.exports = {signup_handler}

function signup_handler(words, msg, apiKey, auth, sheets, spreadsheetId){
    if(words.length <= 6 || words.length > 9) bad_signup(msg, 'syntax')
    else {
        let tier = words[2].toLowerCase()
        if(tier === 'tier1' || tier === 'tier2' || tier === 'tier3'){
            words.push('')
            words.push('')
            sheets.spreadsheets.values.append({
                spreadsheetId: spreadsheetId,
                auth: auth,
                key: apiKey,
                range: tier + '!A:H',
                valueInputOption: 'USER_ENTERED',
                resource: {
                    values: [['', words[1], words[3], words[4], words[5], words[6], words[7], words[8]]]
                }
            }, (err, res) =>{
                if(err){
                    bad_signup(msg, 'backend error')
                }
                msg.reply('Signed up!')
            })

        }
        else bad_signup(msg, 'tier')



    }
}


function bad_signup(msg, reason){
    msg.reply('Incorrect ' + reason + ',\nuse: !signup \"team name\" TierX player1 player2 player3 player4')
}
