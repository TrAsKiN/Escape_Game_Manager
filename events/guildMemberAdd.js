let main = require('../main.js')
let fs = require('fs')

main.on('guildMemberAdd', (member) => {

let data = JSON.parse(fs.readFileSync('./players.json'))
if (data.hasOwnProperty(member.id)) {data[member.id].push(member.guild.name)}
else {data[member.id] = [member.guild.name]}
      fs.writeFile('./players.json',
              JSON.stringify(data, null, 2),
              function(err) { if(err) {return console.log(err)}
              }
      )
})
