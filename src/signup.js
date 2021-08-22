/**
 * Coordinates signups
 */

const SheetService = require('./sheets.js')
module.exports = {signup_handler}

/**
 * Checks to make sure a signup is valid and then signs a team up.
 * Returns team info back to the command callback for use in an embed
 * @param args, the command arguments
 *      '<team name> <tier> <player1> <player2> <player3> <player4> [sub1] [sub2]'
 * @param guild, the guild that the command is used in so that usernames can be fetched
 * @returns {Promise<unknown>}
 *
 * This may truly be callback hell
 */
function signup_handler(input) {
    const args = input.options.map(_ => _.value + '')
    const guild = input.member.guild
    const requester = input.member.user

    const team_name = args[0]
    const player_ids = args.slice(3)
    const vod_link = args[1]

    return new Promise((resolve, reject) => {
        //You must be on the team you sign up for
        if(!player_ids.includes(requester.id)) return reject('You must be on the team')

        //For string similarity purposes you must have a team name longer than 2
        if(team_name.length < 1) return reject('Team name too short')

        //Make sure that a team name has not been used already
        SheetService.get_team_names().then(team_names =>{
            if(team_names.includes(team_name.toLowerCase())) return reject('Team name \"' + team_name + '\" is already in use')

            //Make sure that tier is correct
            const tier = args[2].toLowerCase().replace(/^\d?$/i, 'tier' + args[2])
            if (tier !== 'tier1' && tier !== 'tier2' && tier !== 'tier3') return reject('Invalid Tier')

            //Make sure that a player doesn't appear twice on same team
            const duplicates = get_duplicate_ids(player_ids)
            if(duplicates.length > 0) return reject(notify_duplicates(duplicates))

            //Make sure that users are not signed up already
            SheetService.get_num_signed_up(player_ids).then(player_counts => {
                const conflicts = determine_conflicts(player_counts, player_ids)
                if(conflicts.length > 0) return reject(notify_conflicts(conflicts))

                //Get usernames to put in spreadsheet
                get_names(player_ids, guild).then(names => {

                    //Sign team up
                    SheetService.append_line(tier, get_line(team_name, vod_link, names, player_ids)).then(() => {

                        //Give embed data back to command callback
                        return resolve([player_ids.map(id => '<@' + id + '>'), team_name, tier])
                    }).catch(reject)
                }).catch(reject)
            }).catch(reject)
        }).catch(reject)
    })
}

/**
 * Formatts the row to be added to spreadsheet
 * @param team_name
 * @param names
 * @param player_ids
 * @returns []
 */
function get_line(team_name, vod_link, names, player_ids){
    return [['', team_name, vod_link, names[0], names[1], names[2], names[3],
            names[4] ?? '', names[5] ?? '', '', '', player_ids[0],
            player_ids[1], player_ids[2],
            player_ids[3], player_ids[4] ?? '',
            player_ids[5] ?? '']]
}

/**
 * Formats message in the event that there are duplicate
 * players on one team
 * @param ids
 * @returns {string}
 */
function notify_duplicates(ids){
    let reply = 'Sorry but'
    ids.forEach(id => {
        reply = reply + ' ' + id
    })
    return reply + ' can\'t be on the same team twice.'
}

/**
 * Formats message in the event that there players
 * already signed up on a team
 * @param ids
 * @returns {string}
 */
function notify_conflicts(ids){
    let reply = 'Sorry but'
    ids.forEach(id => {
        reply = reply + ' ' + id
    })
    return reply + (ids.length > 1 ? ' are' : ' is') + ' already on a team.'
}

/**
 * Determines if a player has already signed up from the data
 * taken from the spreadsheet
 * @param conflict_counts
 * @param player_ids
 * @returns {[]}
 */
function determine_conflicts(conflict_counts, player_ids){
    let already_signed_up = []
    for(let i = 0; i < conflict_counts.length; i++){
        if(conflict_counts[i] > 0 && player_ids[i]) already_signed_up.push('<@' + player_ids[i] + '>')
    }
    return already_signed_up
}

/**
 * Gets the username or nickname from discord's api
 * @param ids
 * @param guild
 * @returns {Promise<unknown>}
 */
function get_names(ids, guild){
    return new Promise((resolve, reject) => {
        //Fetch from discord the users
        guild.members.fetch({user: ids}).then(players => {
            resolve(players
                //Needs to be sorted because the names are returned
                    //in increasing order of id.
                    //This sort puts them in the same order as the ids parameter
                .sort((a,b) => ids.indexOf(a.id) - ids.indexOf(b.id))
                //If the user has not set a nickname for the server return their username
                .map(player =>  player.nickname ?? player.user.username)
                )
        }).catch(reject)
    })
}

/**
 * Determines if players appear twice in a signup
 * @param ids
 * @returns {(string|string)[]}
 */
function get_duplicate_ids(ids){
    const no_duplicates = [...new Set(ids)]
    let duplicates = [...ids]
    no_duplicates.forEach((item) => {
        const i = duplicates.indexOf(item)
        duplicates = duplicates.slice(0, i).concat(duplicates.slice(i + 1, duplicates.length))
    })
    //Use set to remove duplicates from the duplicates array
    //Then map to a discord mentionable if id exists
    //Then filter out non existent elements (this happens if there are no subs I think)
    return Array.from(new Set(duplicates)).map(id => id ? '<@' + id + '>' : '').filter(_ => _)
}
