const Discord = require('discord.js');
global.client = new Discord.Client();
const {google} = require('googleapis');
const Sheets = require('./sheets.js')
const WOKCommands = require('./updatedwokcommands')
require('dotenv').config()

//const signup_channel_id = '852287847696039969'
global.server_id = '852287847696039966'

global.client.on('ready', async() => {
    console.log(`Logged in as ${global.client.user.tag}!`)
    const commands = await global.client.api.applications(global.client.user.id).guilds(global.server_id).commands.get()
    console.log(commands)


    new WOKCommands(global.client, {
        commandsDir: 'commands',
        testServers: [global.server_id],
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


