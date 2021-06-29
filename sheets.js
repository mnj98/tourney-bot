const fs = require('fs');
const sheet_setup = require('./sheets_setup.js')

module.exports = {setup, append_line, get_num_signed_up}



const signup_spreadsheetId = "1SA0twJDK9mkc-zwIaSLfDIEfssxd7dMszWRfYwMKnzY"

async function setup(callback){
    fs.readFile('secret.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Google Sheets API.
        sheet_setup.authorize(JSON.parse(content), callback);
    });
}

function get_num_signed_up(ids, msg){
    return new Promise((resolve) => {
        global.sheets.spreadsheets.values.update({
            spreadsheetId: signup_spreadsheetId,
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
                msg.reply('Backend error :(')
                resolve(-1)
            }
            else{
                global.sheets.spreadsheets.values.get({
                    spreadsheetId: signup_spreadsheetId,
                    auth: global.auth,
                    key: process.env.GOOGLE_API_KEY,
                    range: 'BotLogic!A2:F2'
                }, (err, res) =>{
                    resolve(res.data.values[0])
                })
            }
        })
    })
}

async function append_line(msg, tier, values){
    await global.sheets.spreadsheets.values.append({
        spreadsheetId: signup_spreadsheetId,
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
            msg.reply('Backend error :(')
        }
        else msg.reply('Signed up!')
    })
}

