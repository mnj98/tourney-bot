const Discord = require('discord.js');
global.client = new Discord.Client();
const {google} = require('googleapis');
const Sheets = require('./sheets.js')
const WOKCommands = require('./WOKCommands')
require('dotenv').config()

//const signup_channel_id = '852287847696039969'
global.server_id = '852287847696039966'

global.client.on('ready', async() => {
    console.log(`Logged in as ${global.client.user.tag}!`)

    new WOKCommands(global.client, {
        commandsDir: 'commands',
        testServers: [global.server_id],
        showWarns: false
    })

})


Sheets.setup((sheet_auth) => {
    global.auth = sheet_auth
    global.sheets = google.sheets({version: 'v4', sheet_auth})
    global.client.login(process.env.BOT_TOKEN)
})


