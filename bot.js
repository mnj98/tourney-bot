const Discord = require('discord.js');
const client = new Discord.Client();

const {google} = require('googleapis');
//const {GoogleAuth} = require('google-auth-library')
const Sheets = require('./sheets.js')


const spreadsheetId = "1SA0twJDK9mkc-zwIaSLfDIEfssxd7dMszWRfYwMKnzY";
const apiKey = ''
let auth
let sheets




/*
await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: 'Tier1!A:B',
    valueInputOption: "USER_ENTERED",
    resource: {
        values: ['help', '3']
    }
})*/




client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});



client.on('message', msg => {
    if(msg.channel.id === '852287847696039969'){
        let words = [].concat.apply([], msg.content.split('"').map(function(v,i){
            return i%2 ? v : v.split(' ')
        })).filter(Boolean);
        console.log(words)

        if(words[0] === '!signup'){
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

    }

});

function bad_signup(msg, reason){
    msg.reply('Incorrect ' + reason + ',\nuse: !signup \"team name\" TierX player1 player2 player3 player4')
}


Sheets.setup((sheet_auth) => {
    auth = sheet_auth
    sheets = google.sheets({version: 'v4', sheet_auth})
    client.login('')




    /*
    console.log(sheet_auth)

    const sheets = google.sheets({version: 'v4', sheet_auth})
    sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: 'Tier2!A2:b3',
        auth: sheet_auth,
        key: apiKey
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err)
        console.log('blob ' + res.data.values)
    })


    sheets.spreadsheets.values.append({
        spreadsheetId: spreadsheetId,
        range: 'Tier2!A:B',
        key: apiKey,
        auth: sheet_auth,
        valueInputOption: 'USER_ENTERED',
        resource: {
            values: [['bop', 'clop']]
        }
    }, ((err, res) => {
        if (err) return console.log('The API returned an error: ' + err)
        console.log('should have worked')
    }))
    */

})



