/**
 * This file exist because this get fields function is used in two places
 *  so I didn't want to have duplicate code
 */

module.exports = {get_fields}

/**
 * Maps team info into embed fields
 * @param response
 * @returns {[{inline: boolean, name: string, value: *}, {inline: boolean, name: string, value: *}, {inline: boolean, name: string, value: string}]}
 *
 * Team and tier are displayed. Then the players and subs. A blank field is used for spacing
 */
function get_fields(response){
    const [ids, team_name, tier] = response
    let fields = [
        {
            name: 'Team',
            value: team_name,
            inline: true
        },
        tier ? {
            name: 'Tier',
            value: tier,
            inline: true
        } : {name: '\u200b', value: '\u200b', inline: true},
        {name: '\u200b', value: '\u200b', inline: true}] //blank field

    for(let i = 0; i < 2; i++){
        fields.push({
            name: 'Player ' + (i + 1),
            value: ids[i],
            inline: true
        })
    }

    fields.push({name: '\u200b', value: '\u200b', inline: true})

    for(let i = 2; i < 4; i++){
        fields.push({
            name: 'Player ' + (i + 1),
            value: ids[i],
            inline: true
        })
    }

    fields.push({name: '\u200b', value: '\u200b', inline: true})

    for(let i = 4; i < 6; i++){
        if(ids[i]) fields.push({
            name: 'Sub ' + (i - 3),
            value: ids[i],
            inline: true
        })
    }
    if(ids[4]) fields.push({name: '\u200b', value: '\u200b', inline: true})

    return fields
}
