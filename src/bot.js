const Discord = require('discord.js');
const {google} = require('googleapis');
const sheets_setup = require('./sheets_setup.js')
const WOKCommands = require('../CommandHandler')
require('dotenv').config()

process.env.signup_channel_id = '860309288529428480'
process.env.server_id = '852287847696039966'
process.env.signup_spreadsheetId = '1SA0twJDK9mkc-zwIaSLfDIEfssxd7dMszWRfYwMKnzY'

const client = new Discord.Client()

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)

    new WOKCommands(client, {
        commandsDir: '../commands',
        testServers: [process.env.server_id],
        showWarns: false
    })
})


sheets_setup.setup((sheet_auth) => {
    global.auth = sheet_auth
    global.sheets = google.sheets({version: 'v4', sheet_auth})
    client.login(process.env.BOT_TOKEN)
})


