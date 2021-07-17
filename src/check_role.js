/**
 * This file exists because I didn't want to have a bunch of duplicate code
 *  for each command that has to check roles
 */

const Discord = require('discord.js')

module.exports = {is_admin, respond}

const admin_role = '858883421731684382'
const msg = ' You do not have permissions for this command '
const bang = ':bangbang:'
const angry = ':angry:'

/**
 * Makes sure that the user has the required role
 * @param interaction
 *      interaction is a discord.js Interaction object
 * @returns boolean
 */
function is_admin(interaction){
    return interaction.member._roles.includes(admin_role)
}

/**
 * Creates the embed in the case that a user doesn't have the correct
 *  permissions to use a command
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
