let main = require('../main.js')
let fs = require('fs')

main.on('guildMemberRemove', (member) => {

let data = JSON.parse(fs.readFileSync('./players.json'))
data[member.id].splice(data[member.id].indexOf(member.guild.name), 1)
  fs.writeFile('./players.json',
              JSON.stringify(data, null, 2),
              function(err) { if(err) {return console.log(err) }
  })
})
