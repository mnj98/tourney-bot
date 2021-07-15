/**
 * This file exists because I didn't want to have a bunch of duplicate code
 *  for each command that has to check roles
 * @type {module:"discord.js"}
 */

const Discord = require('discord.js')

module.exports = {is_admin, respond}

const admin_role = '858883421731684382'
const msg = ' You do not have permissions for this command '
const bang = ':bangbang:'
const angry = ':angry:'

/**
 * Makes sure that the user has the required role
 * @param input
 *      input contains fields [member, guild, channel, args, text, client, instance, interaction]
 *      which also contain sub-fields. Console log to see the full details
 * @returns boolean
 */
function is_admin(input){
    return input.interaction.member.roles.includes(admin_role)
}

/**
 * Creates the embed in the case that a user doesn't have the correct
 *  permissions to use a command
 * @returns {module:"discord.js".MessageEmbed}
 */
function respond(){
    return new Discord.MessageEmbed()
        .setTitle(bang + bang + msg + bang + bang)
        .setColor('RED')
        .addField('\u200b', angry, true)
        .addField('\u200b', angry, true)
        .addField('\u200b', angry, true)
        .setFooter('Nice Try')
}
