module.exports = {append_line, get_num_signed_up, get_team_names}

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

