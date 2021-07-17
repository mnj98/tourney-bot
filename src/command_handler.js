/**
 * Calls the correct command callback given the commands
 */
const Commands = require('../commands/command_collection.js')

module.exports = {handle}

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
