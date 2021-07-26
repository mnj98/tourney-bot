const fs = require('fs')

//File scope variable to store replies once they have been read from file
let replies = {}

module.exports = {
    description: 'Help with the bot commands',
    name: 'help',
    options: [
        {
            name: 'command', description: 'The command you want help with', type: 3, choices: [
                {name: 'scoring', value: 'scoring'},
                {name: 'signup', value: 'signup'},
                {name: 'timing', value: 'timing'}
            ],
            required: true
        }
    ],
    /**
     * This function replies with the correct help text
     *  Help text is stored in files in /help_text as to not clutter code
     * @param interaction
     */
    callback: interaction => {

        const command_name = interaction.options.get('command').value
        const reply = replies[command_name]

        //If the text has already been written to memory just use that
        if(reply) interaction.reply({content: reply})
        //read from file
        else fs.readFile('./help_text/' + command_name + '.txt', 'utf8', (err, data) => {
                if(err) interaction.reply({embeds: [
                        new Discord.MessageEmbed()
                            .setTitle('File Read Error')
                            .addField('Error', err + '')
                    ]
                })
                else {
                    replies[command_name] = data
                    interaction.reply({content: data})
                }
            })
    }
}
