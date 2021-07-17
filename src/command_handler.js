/**
 * Calls the correct command callback given the commands
 */
const Commands = require('../commands/command_collection.js')

module.exports = {handle, create_commands, delete_commands, edit_commands}

/**
 * Converts Commands object into an array,
 *  find correct command,
 *  run callback
 * @param interaction
 */
function handle(interaction){

    //the ?. means run the callback if the find command succeeds
    Object.values(Commands).find(command =>
        interaction.commandName === command.name
    )?.callback(interaction)
}

/**
 * A function to hanlde operations on the commands.
 *  Probably will be useful when changing to official server
 * @param guild
 * @param commands
 */
function commands_operation(operation, commands, msg){
    Promise.all(Object.values(commands).map(operation))
        .then(() => console.log(msg)).catch(console.log)
}

/**
 * A function to edit all the commands.
 *  Probably will be useful when changing to official server
 * @param guild
 * @param commands
 */
function edit_commands(guild, commands = Commands){
    commands_operation(guild.commands.edit, commands, 'Commands Edited')
}

/**
 * A function to delete all the commands.
 *  Probably will be useful when changing to official server
 * @param guild
 * @param commands
 */
function delete_commands(guild, commands = Commands){
    commands_operation(guild.commands.delete, commands, 'Commands Deleted')
}

/**
 * A function to create all the commands.
 *  Probably will be useful when changing to official server
 * @param guild
 * @param commands
 */
function create_commands(guild, commands = Commands){
    commands_operation(guild.commands.create, commands, 'Commands Created')
}
