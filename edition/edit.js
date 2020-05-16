const fs = require ('fs')
let main = require('../main.js')

module.exports = (message) => {
    let srv  = message.channel
    let file = `./guilds/${message.channel.guild.name}/${message.channel.guild.name}.json`

    message.channel.send(
`***Bienvenue dans l\'assistant d\'édition. Tous vos messages doivent être précédés du signe "#".***
*Assurez vous d'utiliser un salon discord privé afin de ne pas rendre les réponses publiques.*
***Veuillez entrer le nombre d\'étapes prévues pour votre jeu, précédé par "#". (le nombre d\'étapes correspond au nombre de codes à trouver)***`
    )
    .then(() => {
        let filter = m => (m.content.startsWith("#"))
        let data   = JSON.parse('{"answers": {"etape 0": {}}, "etapes": 0, "start": "!start" }')

        try {
            fs.mkdirSync('./guilds/' + message.channel.guild.name)
        }
        catch(err) {}
        message.channel.awaitMessages(filter, {max: 1})
        .then(e => {
            data.etapes = Number(e.first().content.replace("#",""))
            if (isNaN(data.etapes)) {
                return (message.channel.send('Erreur dans la déclaration. Réessayez.'))
            }

            message.channel.send(`souhaitez vous confimer ${data.etapes} étapes ? #oui/#non`)
            .then(() => {
                message.channel.awaitMessages(filter, {max: 1, time: 60000, error: ['time']})
                .then(f => {
                    rep = f.last().content.replace("#","").toLowerCase()
                    if (rep === 'oui') {
                        let etp = ""
                        for (i = 1; i <= data.etapes; i++) {
                            etp = "Etape " + i
                            data.answers[etp.toLowerCase()] = {}
                        }
                        data.answers.final = "Explorateurs"
                        if (message.channel.guild.roles.find(r => r.name === 'Explorateurs') === null) {
                            message.channel.guild.createRole({name: "Explorateurs", hoist: true, color: '#f6ff00'})
                        }
                        fs.writeFile(file, JSON.stringify(data, null, 2), function(err) {
                            if (err) return
                        })
                        message.channel.send(
`${data.etapes} étapes ont été créées !
Vous pouvez maintenant éditer les étapes.
***Attention, Toutes ces données sont modifiables à tout moment. Soyez certain de vos actions une fois le jeu lancé !***
N'hésitez pas à épingler ce message. `,
                        {embed: require('../edition/commandslist.js')}
                        )
                    } else {
                        return message.channel.send('Abandon de l\'édition, aucun changement n\'a été pris en compte')
                    }
                })
                .catch(function(error) {
                    console.log(error)
                    message.channel.send('Abandon de l\'édition, aucun changement n\'a été pris en compte')
                })
            })
            .catch(function(error) {
                if (error) return
            })
        })
        .catch(function(error) {
            message.channel.send('Erreur dans la déclaration. Réessayez.')
        })
    })
}
