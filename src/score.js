/**
 * Handles parsing and calculating scores through the google sheet
 */

//TODO: Allow for less than 4 maps being entered

const similarity = require('string-similarity')
const SheetService = require('./sheets')

module.exports = {score_handler}

/**
 * Uses the commands input to convert input in to true
 *  map names, difficulties, and attempt numbers
 *
 * It then sends uses sheets.js to get the score value
 * @param args
 * @returns {Promise<unknown>}
 */
function score_handler(args){
    //Re-format the args
    const maps = [args[0], args[3], args[6], args[9]]
    const diffs = [args[1], args[4], args[7], args[10]]
    const attempts = [args[2], args[5], args[8], args[11]]


    return new Promise((resolve, reject) => {

        //Convert maps input into their true name if possible,
            //otherwise throw error
        validate_maps(maps).then(valid_maps => {

            //Convert difficulty input into their true names if possible,
                //otherwise throw error
            validate_diffs(diffs).then(valid_diffs => {

                //1-3 represent valid attempt numbers
                    //anything else is mapped to 0
                const valid_attempts = attempts.map(num =>
                    num >= 0 && num <= 3 ? num : 0
                )
                //Use sheet service to get the score from the google sheet
                SheetService.get_score(valid_maps, valid_diffs, valid_attempts).then(score =>{

                    //Resolve with the data needed to format the embed
                    resolve([valid_maps, valid_diffs, valid_attempts, score])
                }).catch(reject)
            }).catch(reject)
        }).catch(reject)
    })
}

/**
 * A generic function to validate input,
 *  reduces duplicate code
 *
 * This function uses a npm package called string-similarity to
 *  determine the best match for a given input. Uses Sørensen–Dice coefficient
 *  to find the closest match. This is used for map name and difficulty
 *  https://en.wikipedia.org/wiki/S%C3%B8rensen%E2%80%93Dice_coefficient
 *
 * I use 0.2 as an arbitrary cutoff. If a string's similarity is below 0.2
 *  I have decided that there is no match, and the promise will reject
 *
 * The diffs parameter is optional and is used to do additional parsing
 *  to the difficulty string. i.e. converting c -> cata so that
 *  string similarity algorithm has a higher chance of returning a success.
 * @param score_vals
 * @param get_function
 * @param fail_msg
 * @param diffs - optional
 * @returns {Promise<unknown>}
 */
function validate(score_vals, get_function, fail_msg, diffs = false){
    return new Promise((resolve, reject) => {

        //call respective get function
        get_function.then(vals => {
            //create list of similarity objects
            const closest_vals = score_vals.map(val =>
                similarity.findBestMatch(
                    //handle if diffs = true
                    diffs ? val.replace(/c(?!ata)/i, 'cata') : val,

                    //Search through the array of true values (map names, difficulties)
                        //gotten from the sheet to determine similarity
                    vals)
            )

            //Determine if any best match is less than 0.2, and reject
            const invalid_val = closest_vals.findIndex(val => val.bestMatch.rating < 0.2)
            if(invalid_val >=0 ) reject(fail_msg + score_vals[invalid_val])
            //If there are no problems, resolve with the best match
            else{
                resolve(closest_vals.map(_ => _.bestMatch.target))
            }
        }).catch(reject)
    })
}

/**
 * Calls validate with the correct parameters for difficulty
 * @param score_diffs
 * @returns {Promise<ChannelType.unknown>}
 */
function validate_diffs(score_diffs){
    return validate(score_diffs, SheetService.get_diffs(), 'Unknown Difficulty: ', true)
}

/**
 * Calls validate with the correct parameters for maps
 * @param score_maps
 * @returns {Promise<ChannelType.unknown>}
 */
function validate_maps(score_maps){
    return validate(score_maps, SheetService.get_maps(), 'Unknown Map: ')
}
