const Discord = require('discord.js');
const {google} = require('googleapis');
const sheets_setup = require('./sheets_setup.js')
const WOKCommands = require('../CommandHandler')
require('dotenv').config()

const timer = require('./timer.js')

process.env.signup_channel_id = '860309288529428480'
process.env.server_id = '852287847696039966'
process.env.signup_spreadsheetId = '1SA0twJDK9mkc-zwIaSLfDIEfssxd7dMszWRfYwMKnzY'

process.env.T1_NAMES = 'Tier1!B2:B300'
process.env.T1_TIMES = 'Tier1!I2:I300'
process.env.T1_IDS = 'Tier1!K2:P300'
process.env.T2_NAMES = 'Tier2!B2:B300'
process.env.T2_TIMES = 'Tier2!I2:I300'
process.env.T2_IDS = 'Tier2!K2:P300'
process.env.T3_NAMES = 'Tier3!B2:B300'
process.env.T3_TIMES = 'Tier3!I2:I300'
process.env.T3_IDS = 'Tier3!K2:P300'

const client = new Discord.Client()

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)

    new WOKCommands(client, {
        commandsDir: '../commands',
        testServers: [process.env.server_id],
        showWarns: false
    })

    timer.get_formatted_timer_data('day1').then(console.log).then(console.log)
})


sheets_setup.setup((sheet_auth) => {
    global.auth = sheet_auth
    global.sheets = google.sheets({version: 'v4', sheet_auth})
    client.login(process.env.BOT_TOKEN)
})


