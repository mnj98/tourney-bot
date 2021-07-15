/**
 * This discord bot is designed for the Vermintide 2 Onslaught Series Discord
 *
 * Code written by Matthew Jackson except where noted.
 * CommandHandler is written by Worn Of Keys, but I have edited it slightly
 * stopwatch.js is based on the stopwatch node package but heavily edited for my use
 * sheets_setup is from https://developers.google.com/sheets/api/quickstart/nodejs with edits
 *
 * Feel free to use this code except if you violate the ACM code of ethics with it.
 * https://www.acm.org/code-of-ethics
 *
 * However, I do not guarantee that anything works :)
 */


const Discord = require('discord.js');
const {google} = require('googleapis');
const sheets_setup = require('./sheets_setup.js')
const WOKCommands = require('../CommandHandler')
require('dotenv').config()

process.env.signup_channel_id = '860309288529428480'
process.env.server_id = '852287847696039966'
process.env.signup_spreadsheetID = '1SA0twJDK9mkc-zwIaSLfDIEfssxd7dMszWRfYwMKnzY'
process.env.score_spreadsheetID = '1hut-DtlaSebQmGqef9QSQdSodTjtm3ieroYnM0NVNdE'
process.env.notification_channel_id = '861363394685435905'

client = new Discord.Client()

//Runs when bot has logged in
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)

    //Command handler, commands are defined in ../commands
    new WOKCommands(client, {
        commandsDir: '../commands',
        testServers: [process.env.server_id],
        showWarns: false
    })
})

/**
 * Runs at startup
 *
 * Authenticates with google and then logs the bot in
 */
sheets_setup.setup((sheet_auth) => {
    global.auth = sheet_auth
    global.sheets = google.sheets({version: 'v4', sheet_auth})
    client.login(process.env.BOT_TOKEN)
})
