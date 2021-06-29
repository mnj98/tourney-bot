const Discord = require('discord.js');
client = new Discord.Client();
const {google} = require('googleapis');
const Sheets = require('./sheets.js')
const signups = require('./signup.js')
const WOKCommands = require('wokcommands')
require('dotenv').config()

const signup_channel_id = '852287847696039969'
const server_id = '852287847696039966'

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
    new WOKCommands(client, {
        commandsDir: 'commands',
        testServers: [server_id],
        showWarns: false
    })

})


/*
client.on('message', msg => {
    if(msg.channel.id === signup_channel_id){
        let words = get_words(msg)
        console.log(words)

        if(words[0] === '!signup'){
            signups.signup_handler(words, msg)
        }

        if(words[0] === '!roster'){
            msg.reply('https://docs.google.com/spreadsheets/d/1SA0twJDK9mkc-zwIaSLfDIEfssxd7dMszWRfYwMKnzY/edit#gid=0')
        }
    }
})*/

Sheets.setup((sheet_auth) => {
    global.auth = sheet_auth
    global.sheets = google.sheets({version: 'v4', sheet_auth})
    global.client.login(process.env.BOT_TOKEN)

})

function get_words(msg){
    return [].concat.apply([], msg.content.split('"').map((v,i) => {
        return i%2 ? v : v.split(' ')
    })).filter(Boolean)
}



