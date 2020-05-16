let fs     = require('fs')
let path   = require('path')
let main   = require('../main.js')
let answer = require('../answers/answers.js')
let edit   = require('../edition/edit.js')
let data   = {}
let { Attachment } = require('discord.js')

main.on('message', message => {
  if (message.author.bot) return

  let pFile     = JSON.parse(fs.readFileSync(path.resolve('../players.json')))
  let guildPath = `./guilds/${message.channel.guild}/${message.channel.guild}.json`
  if (fs.existsSync(guildPath)) {
    data = JSON.parse(fs.readFileSync(guildPath))
  }

  function permchk(fct) {
    if (message.channel.permissionsFor(message.author).has(0x8)) {
      return fct
    }
    else {
      return message.reply('Vous ne semblez pas avoir les droits nécessaires pour éditer le jeu. Seuls les administrateurs le peuvent.')
    }
  }

  if (message.channel.type === 'dm') {
    try {
      answer.run(message, main)
    }
    catch (err) {
      console.log(err)
      message.reply('Erreur dans le jeu. Contactez l\'administrateur.')
    }
    return
  }

  if (message.content === '!edit') {
    permchk(edit(message))
  }
  if (message.content === '!commandes') {
    permchk(message.channel.send({embed: require('../edition/commandslist.js')}))
  }
  if (message.content.toLowerCase().startsWith("#")) {
    permchk(require(`../edition/command.js`)(message))
  }

  if (message.content === data.start) {
    let suc = require(`../guilds/${message.channel.guild}/success/0.js`)
    message.reply(`Attention si vous commencez une partie sur ce serveur, vous ne pourrez pas continuer la partie sur les autres serveurs.`)
    message.channel.guild.member(message.author.id).addRole(message.channel.guild.roles.find(r => r.name === ('etape 1')))

    if (pFile.hasOwnProperty(message.author.id)) {
      pFile[message.author.id].forEach(g => {
        if (g === message.channel.guild.name) return
      })
      pFile[message.author.id].push(message.channel.guild.name)
    } else {
      pFile[message.author.id] = [message.channel.guild.name]
    }

    if (data.answers[`etape 0`].file !== {}) {
      let att = new Attachment (data.answers[`etape 0`].file)
      return message.author.createDM().then(channel => channel.send(suc, att))
    } else {
      return message.author.createDM().then(channel => channel.send(suc))
    }

    fs.writeFile('./players.json', JSON.stringify(pFile, null, 2), function(err) {
      if(err) {
        return console.log(err)
      }
    })
  }
})
