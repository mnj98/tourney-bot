/**
 * This discord bot is designed for the Vermintide 2 Onslaught Series Discord
 *
 * Code written by Matthew Jackson except where noted.
 * stopwatch.js is based on the stopwatch node package but heavily edited for my use
 *
 * Feel free to use this code except if you violate the ACM code of ethics with it.
 * https://www.acm.org/code-of-ethics
 *
 * However, I do not guarantee that anything works :)
 */

const Discord = require('discord.js')
const Sheets = require('./sheets.js')
const CommandHandler = require('./command_handler.js')

//Load environment variables
require('custom-env').env('public')
require('custom-env').env('private')

client = new Discord.Client({intents: new Discord.Intents()})

//Runs when bot has logged in
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

//Handle Interactions (slash commands)
client.on('interactionCreate', interaction => {
    if (interaction.isCommand()) CommandHandler.handle(interaction)
})

/**
 * Runs at startup
 *
 * Authenticates with google and then logs the bot in
 */
Sheets.setup().then(() =>
    client.login(process.env.BOT_TOKEN)
).catch(console.log)
