//TODO: Create scoring functions. use spreadsheet.js's get_maps() function
//https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/batchUpdate
//https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values#ValueRange

//use string-similarity to infer maps and difficulties

//anything other than 1,2,3 is a map fail

//use batch update to update values
//read score number
const similarity = require('string-similarity')
const SheetService = require('./sheets')

module.exports = {score_handler}

function score_handler(args){
    const maps = [args[0], args[3], args[6], args[9]]
    const diffs = [args[1], args[4], args[7], args[10]]
    const attempts = [args[2], args[5], args[8], args[11]]

    return new Promise((resolve, reject) => {
        validate_maps(maps).then(valid_maps => {
            validate_diffs(diffs).then(valid_diffs => {
                const valid_attempts = attempts.map(num =>
                    num >= 0 && num <= 3 ? num : 0
                )
                SheetService.get_score(valid_maps, valid_diffs, valid_attempts).then(score =>{
                    resolve([valid_maps, valid_diffs, valid_attempts, score])
                }).catch(reject)
            }).catch(reject)
        }).catch(reject)
    })
}

function validate(score_vals, get_function, fail_msg, diffs = false){
    return new Promise((resolve, reject) => {
        get_function.then(vals => {
            const closest_vals = score_vals.map(val =>
                similarity.findBestMatch(
                    diffs ? val.replace(/c(?!ata)/i, 'cata') : val,
                    vals)
            )

            const invalid_val = closest_vals.findIndex(val => val.bestMatch.rating < 0.2)
            if(invalid_val >=0 ) reject(fail_msg + score_vals[invalid_val])
            else{
                resolve(closest_vals.map(_ => _.bestMatch.target))
            }
        }).catch(reject)
    })
}

function validate_diffs(score_diffs){
    return validate(score_diffs, SheetService.get_diffs(), 'Unknown Difficulty: ', true)
}

function validate_maps(score_maps){
    return validate(score_maps, SheetService.get_maps(), 'Unknown Map: ')
}
