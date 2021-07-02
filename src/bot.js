const Discord = require('discord.js');
global.client = new Discord.Client();
const {google} = require('googleapis');
const sheets_setup = require('./sheets_setup.js')
const WOKCommands = require('../CommandHandler')
require('dotenv').config()

global.signup_channel_id = '860309288529428480'
global.server_id = '852287847696039966'

global.client.on('ready', async() => {
    console.log(`Logged in as ${global.client.user.tag}!`)

    new WOKCommands(global.client, {
        commandsDir: '../commands',
        testServers: [global.server_id],
        showWarns: false
    })

})


sheets_setup.setup((sheet_auth) => {
    global.auth = sheet_auth
    global.sheets = google.sheets({version: 'v4', sheet_auth})
    global.client.login(process.env.BOT_TOKEN)
})


