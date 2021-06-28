const Discord = require('discord.js');
const client = new Discord.Client();
const {google} = require('googleapis');
const Sheets = require('./sheets.js')
const signups = require('./signup.js')
require('dotenv').config()

const signup_spreadsheetId = "1SA0twJDK9mkc-zwIaSLfDIEfssxd7dMszWRfYwMKnzY";
const apiKey = process.env.GOOGLE_API_KEY
let auth
let sheets

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
            signups.signup_handler(words, msg, client, apiKey, auth, sheets, signup_spreadsheetId)
        }
        if(words[0] === '!roster'){
            msg.reply('https://docs.google.com/spreadsheets/d/1SA0twJDK9mkc-zwIaSLfDIEfssxd7dMszWRfYwMKnzY/edit#gid=0')
        }
    }
});

Sheets.setup((sheet_auth) => {
    auth = sheet_auth
    sheets = google.sheets({version: 'v4', sheet_auth})
    client.login(process.env.BOT_TOKEN)

})



