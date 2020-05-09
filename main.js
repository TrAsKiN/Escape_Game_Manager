let fs = require('fs')
let Discord = require('discord.js')
let main = new Discord.Client

module.exports = main
	try {require('./events/ready.js')
	require('./events/guildMemberAdd.js')
	require('./events/message.js')
	require('./events/guildMemberRemove.js')}
	catch(err){console.log(err)}

main.login('Never gonna give you up...')
