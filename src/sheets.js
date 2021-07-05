module.exports = {append_line, get_num_signed_up, get_team_names, get_timer_data}

const T1_NAMES = 'Tier1!B2:B300'
const T1_TIMES = 'Tier1!I2:I300'
const T1_IDS = 'Tier1!K2:P300'
const T2_NAMES = 'Tier2!B2:B300'
const T2_TIMES = 'Tier2!I2:I300'
const T2_IDS = 'Tier2!K2:P300'
const T3_NAMES = 'Tier3!B2:B300'
const T3_TIMES = 'Tier3!I2:I300'
const T3_IDS = 'Tier3!K2:P300'

function get_num_signed_up(ids){
    return new Promise((resolve, reject) => {
        global.sheets.spreadsheets.values.update({
            spreadsheetId: process.env.signup_spreadsheetId,
            auth: global.auth,
            key: process.env.GOOGLE_API_KEY,
            range: 'BotLogic!A1:F1',
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [ids]
            }
        }, (err, res) =>{
            if (err) {
                console.log(err)
                reject(err)
            }
            else{
                global.sheets.spreadsheets.values.get({
                    spreadsheetId: process.env.signup_spreadsheetId,
                    auth: global.auth,
                    key: process.env.GOOGLE_API_KEY,
                    range: 'BotLogic!A2:F2'
                }, (err, res) =>{
                    if(err){
                        console.log(err)
                        reject(err)
                    }
                    else resolve(res.data.values[0])
                })
            }
        })
    })
}

function append_line(tier, values){
    return new Promise((resolve, reject) => {
        global.sheets.spreadsheets.values.append({
            spreadsheetId: process.env.signup_spreadsheetId,
            auth: global.auth,
            key: process.env.GOOGLE_API_KEY,
            range: tier + '!A:P',
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: values
            }
        }, (err, res) => {
            if (err) {
                console.log(err)
                reject(err)
            }
            else resolve()
        })
    })
}


function get_team_names(){
    return new Promise((resolve, reject) => {
        global.sheets.spreadsheets.values.get({
            spreadsheetId: process.env.signup_spreadsheetId,
            auth: global.auth,
            key: process.env.GOOGLE_API_KEY,
            range: 'BotLogic!A4'
        }, (err, res) => {
            if(err){
                console.log(err)
                reject(err)
            }
            else{
                if(res.data.values){
                    resolve(res.data.values[0][0].split('\n').map(teamName => teamName.toLowerCase()))
                }
                else resolve([])
            }
        })
    })
}

function get_timer_data(){
    return new Promise((resolve, reject) => {
        global.sheets.spreadsheets.values.batchGet({
            spreadsheetId: process.env.signup_spreadsheetId,
            auth: global.auth,
            key: process.env.GOOGLE_API_KEY,
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
            if(err){
                console.log(err)
                reject(err)
            }
            else{
                resolve(res.data.valueRanges.map(range => range.values))
            }
        })
    })
}

