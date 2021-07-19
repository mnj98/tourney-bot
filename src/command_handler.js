/**
 * Calls the correct command callback given the commands
 */

/**
 * Collects all the commands to that only 1 require() is required to require all commands
 *  The field names don't really matter
 */
const Commands = {
    ADD_TIME: require('./commands/add-time.js'),
    CLEAR_CLOCK: require('./commands/clear-clock.js'),
    CODE: require('./commands/code.js'),
    ROSTER: require('./commands/roster.js'),
    SCORE: require('./commands/score.js'),
    START_TIMERS: require('./commands/start-timers.js'),
    TIMER_INFO: require('./commands/timer-info.js'),
    SIGNUP: require('./commands/signup.js')
}

module.exports = {
    handle,
    create_commands,
    delete_commands,
    edit_commands,
    fetch_command_names,
    Commands
}

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
 * Gets the names
 * @param guild
 * @returns {Promise<unknown>}
 */
function fetch_command_names(guild){
    return new Promise((resolve, reject) => {
        guild.commands.fetch().then(cmds =>
            resolve(cmds.map(_ => _.name))
        ).catch(reject)
    })
}

/**
 * A function to merge sets of commands and get id
 *  Probably will be useful when changing to official server
 * @param guild
 * @param local_commands
 */
function get_matching_commands(guild, local_commands){
    return new Promise((resolve, reject) => {
        guild.commands.fetch().then(cmds => {
            resolve (cmds.filter(
                cmd => Object.values(local_commands)
                    .map(_ => _.name)
                    .includes(cmd.name))
            )
        }).catch(reject)
    })
}

/**
 * Helper to create edit or delete commands
 * @param guild
 * @param operation
 * @param commands for create its an object of commands
 *          but for edit or delete its just the id string
 * @param msg
 * @param edit_cmds
 */
function commands_operation(guild, operation, commands, msg){
    return new Promise((resolve, reject) => {
        Promise.all(commands.map(cmd => guild.commands[operation](cmd)))
            .then(() => resolve(msg))
            .catch(reject)
    })
}

/**
 * A function to edit all the commands.
 *  Probably will be useful when changing to official server
 *
 *  For some reason commands.edit was not working
 * @param guild
 * @param commands
 */
function edit_commands(guild, commands = Commands){
    return new Promise((resolve, reject) => {
        delete_commands(guild, commands).then(() => {
            create_commands(guild, commands).then(() => resolve('Commands Edited'))
                .catch(reject)
        }).catch(reject)
    })
}

/**
 * A function to delete all the commands.
 *  Probably will be useful when changing to official server
 * @param guild
 * @param commands
 */
function delete_commands(guild, commands = Commands){
    return get_matching_commands(guild, commands).then(cmds =>
        commands_operation(guild, 'delete', cmds.map(_ => _.id), 'Commands Deleted')
    )
}

/**
 * A function to create all the commands.
 *  Probably will be useful when changing to official server
 * @param guild
 * @param commands
 */
function create_commands(guild, commands = Commands){
    return commands_operation(guild, 'create',
        Object.values(commands),
        'Commands Created')
}
