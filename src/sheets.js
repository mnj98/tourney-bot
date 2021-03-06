/**
 * Google sheets functions.
 */

const {google} = require('googleapis')
const {GoogleAuth} = require('google-auth-library')

module.exports = {
    append_line,
    get_num_signed_up,
    get_team_names,
    get_timer_data,
    get_maps,
    get_diffs,
    get_score,
    setup
}

const T1_NAMES = 'Tier 1- Cata1 Dwons!B3:B300'
const T1_TIMES = 'Tier 1- Cata1 Dwons!J3:J300'
const T1_IDS = 'Tier 1- Cata1 Dwons!M3:R300'
const T2_NAMES = 'Tier 2- Cata3 Dwons!B3:B300'
const T2_TIMES = 'Tier 2- Cata3 Dwons!J3:J300'
const T2_IDS = 'Tier 2- Cata3 Dwons!M3:R300'
const T3_NAMES = 'Tier 3- Cata3 Dwons+!B3:B300'
const T3_TIMES = 'Tier 3- Cata3 Dwons+!J3:J300'
const T3_IDS = 'Tier 3- Cata3 Dwons+!M3:R300'

//File scope vars
let auth, sheets

/**
 * Setup the auth for google sheets
 * @returns {Promise<unknown>}
 */
function setup(){
    return new Promise((resolve, reject) => {
        auth = new GoogleAuth({
            keyFile: 'secret.json',
            scopes: 'https://www.googleapis.com/auth/spreadsheets'
        })

        auth.getClient().then(authClient => {
            sheets = google.sheets({
                version: 'v4',
                auth: authClient
            })
            resolve()
        }).catch(reject)
    })
}

/**
 * Gets the number of times an array of user ids appears in the BOT_HIDDEN
 * sections of the spreadsheet. What this is used for is to determine if a
 * user has already signed up on a team.
 * @param ids, ids.length must be 6 at most
 * @returns {Promise<unknown>}
 */
function get_num_signed_up(ids){
    //Returns a promise that can fail
    return new Promise((resolve, reject) => {
        //First populate id row with ids
        sheets.spreadsheets.values.update({
            spreadsheetId: process.env.SIGNUP_SPREADSHEET_ID,
            auth: auth,
            range: 'BotLogic!A1:F1',
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [ids]
            }
        }, (err, res) =>{
            if(err) reject(err)
            else{
                //Once ids are populated, read the count
                //the count is calculated by a spreadsheet function
                sheets.spreadsheets.values.get({
                    spreadsheetId: process.env.SIGNUP_SPREADSHEET_ID,
                    auth: auth,
                    range: 'BotLogic!A2:F2'
                }, (err, res) =>{
                    if(err) reject(err)
                    else resolve(res.data.values[0])
                })
            }
        })
    })
}

/**
 * Appends a team to the signup document
 * @param tier
 * @param values
 * @returns {Promise<unknown>}
 */
function append_line(tier, values){
    //Returns a promise that can fail
    return new Promise((resolve, reject) => {
        //appends values to tier page
        sheets.spreadsheets.values.append({
            spreadsheetId: process.env.SIGNUP_SPREADSHEET_ID,
            auth: auth,
            range: tier + '!A:R',
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: values
            }
        }, (err, res) => {
            if(err) reject(err)
            else resolve()
        })
    })
}

/**
 * Gets a list of team names
 * Used to ensure that there are no duplicate team names
 * @returns {Promise<unknown>}
 */
function get_team_names(){
    return new Promise((resolve, reject) =>{
        //Use generic get function
        get('BotLogic!A4', process.env.SIGNUP_SPREADSHEET_ID)
            .then(teams => {
                if(teams.length === 0) resolve(teams)
                else resolve(teams[0].split('\n').map(teamName => teamName.toLowerCase()))
            }).catch(reject)
    })
}

/**
 * Gets specific info for timer.js functions
 * Gets the names, timeslots, and ids of all teams
 * In the spreadsheet this info is broken up by tier,
 * but I just collect it all together since a team in Tier2 could
 * play on Tier1's day.
 * @returns {Promise<unknown>}
 */
function get_timer_data(){
    //Returns a promise that can fail
    return new Promise((resolve, reject) => {
        sheets.spreadsheets.values.batchGet({
            spreadsheetId: process.env.SIGNUP_SPREADSHEET_ID,
            auth: auth,
            //ranges defined above
            ranges: [
                T1_NAMES,
                T1_TIMES,
                T1_IDS,
                T2_NAMES,
                T2_TIMES,
                T2_IDS,
                T3_NAMES,
                T3_TIMES,
                T3_IDS
            ]
        }, (err, res) => {
            if(err) reject(err)
            else{
                //pull just the data
                resolve(res.data.valueRanges.map(range => range.values))
            }
        })
    })
}

/**
 * First puts score info into the sheet. Then it gets the score value
 * @param maps
 * @param diffs
 * @param attempts
 * @returns {Promise<unknown>}
 */
function get_score(maps, diffs, attempts, number_of_maps){
    return new Promise((resolve, reject) => {

        //Update all the required info
        sheets.spreadsheets.values.batchUpdate({
            spreadsheetId: process.env.SCORE_SPREADSHEET_ID,
            auth: auth,
            resource: {
                valueInputOption: 'USER_ENTERED',
                data: [
                    {
                        range: 'BotLogic!A2:A5',
                        majorDimension: 'COLUMNS',
                        values: [attempts]
                    },
                    {
                        range: 'BotLogic!B2:B5',
                        majorDimension: 'COLUMNS',
                        values: [maps]
                    },
                    {
                        range: 'BotLogic!D2:D5',
                        majorDimension: 'COLUMNS',
                        values: [diffs]
                    }
                ]
            }
        }, ((err, res) => {
            if(err) reject(err)
            else{
                get('BotLogic!G' + number_of_maps, process.env.SCORE_SPREADSHEET_ID)
                    .then(score => {
                        resolve(score[0])
                    }).catch(reject)
            }
        }))
    })
}

/**
 * Generic get function that gets from a range and doc
 *
 * Cannot be used for ranges of all formats since this function
 *  specifically reduces the dimension of array returned
 * @param range
 * @param doc
 * @returns {Promise<unknown>}
 */
function get(range, doc){
    return new Promise((resolve, reject) =>{
        sheets.spreadsheets.values.get({
            spreadsheetId: doc,
            auth: auth,
            range: range
        }, (err, res) => {
            if(err) reject(err)
            else{
                //Map the 2 or more dimension array down
                if(res.data.values) resolve(res.data.values.map(_ => _[0]))
                //Sometimes res.data will have no values field, in this case
                    //resolve with an empty array
                else resolve([])
            }
        })
    })
}

/**
 * Get the list of maps
 */
function get_maps(){
    return get('Tables!A2:A100', process.env.SCORE_SPREADSHEET_ID)
}

/**
 * Get the list of difficulties
 */
function get_diffs(){
    return get('Tables!D2:D100', process.env.SCORE_SPREADSHEET_ID)
}
