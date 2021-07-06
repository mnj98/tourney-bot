module.exports = {is_admin}

const admin_role = '858883421731684382'

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
