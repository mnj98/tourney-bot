const fs = require('fs');
const sheet_setup = require('./sheets_setup.js')

module.exports = {setup, append_line, get_if_signed_up}

async function setup(callback){
    fs.readFile('secret.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Google Sheets API.
        sheet_setup.authorize(JSON.parse(content), callback);
    });
}

function get_if_signed_up(ids, msg, spreadsheetId, auth, apiKey, sheets){
    return new Promise((resolve) => {
        sheets.spreadsheets.values.update({
            spreadsheetId: spreadsheetId,
            auth: auth,
            key: apiKey,
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
                sheets.spreadsheets.values.get({
                    spreadsheetId: spreadsheetId,
                    auth: auth,
                    key: apiKey,
                    range: 'BotLogic!A2:F2'
                }, (err, res) =>{
                    resolve(res.data.values)
                })
            }
        })
    })
}

async function append_line(msg, tier, values, spreadsheetId, auth, apiKey, sheets){
    await sheets.spreadsheets.values.append({
        spreadsheetId: spreadsheetId,
        auth: auth,
        key: apiKey,
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

