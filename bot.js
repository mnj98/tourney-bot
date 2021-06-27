const Discord = require('discord.js');
const client = new Discord.Client();

const {google} = require('googleapis');
//const {GoogleAuth} = require('google-auth-library')
const Sheets = require('./sheets.js')
const signups = require('./signup.js')
require('dotenv').config()

const signup_spreadsheetId = "1SA0twJDK9mkc-zwIaSLfDIEfssxd7dMszWRfYwMKnzY";
const apiKey = process.env.GOOGLE_API_KEY
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
    
    console.log(msg.author.id)
    client.users.fetch(msg.content.match(/\d+/g)[0]).then(usr => console.log(usr.username))
    if(msg.channel.id === '852287847696039969'){
        let words = [].concat.apply([], msg.content.split('"').map(function(v,i){
            return i%2 ? v : v.split(' ')
        })).filter(Boolean);
        console.log(words)

        if(words[0] === '!signup'){
            signups.signup_handler(words, msg, apiKey, auth, sheets, signup_spreadsheetId)

        }

    }

});




Sheets.setup((sheet_auth) => {
    auth = sheet_auth
    sheets = google.sheets({version: 'v4', sheet_auth})
    client.login(process.env.BOT_TOKEN)




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



