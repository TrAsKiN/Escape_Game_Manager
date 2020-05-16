let fs = require('fs')
let Discord = require('discord.js')
let main = new Discord.Client
let config = require('./config.json')

module.exports = main
try {
    require('./events/ready.js')
    require('./events/message.js')
    require('./events/guildMemberAdd.js')
    require('./events/guildMemberRemove.js')
}
catch(err) {
    console.log(err)
}

main.login(config.token)
