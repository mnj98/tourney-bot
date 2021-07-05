
module.exports = {is_admin}

const admin_role = '858883421731684382'

function is_admin(input){
    return input.interaction.member.roles.includes(admin_role)
}
