const Discord = require('discord.js');
const Localization = require('../Localization.js');
const { locale } = require('../config.json');
const localize = new Localization(locale);

module.exports = {
    name: 'edit',
    description: localize.parse('edit_description'),
    usage: '<intro|ending|step|insert|delete|check|roles> <arguments>',
    guildOnly: true,
    aliases: ['set'],
    public: true,
    permissions: [
        'MANAGE_ROLES'
    ],
    execute(message, args) {
        if (!args[0]) {
            const embed = new Discord.MessageEmbed()
                .setTitle(localize.parse('edit_howtitle'))
                .setDescription(localize.parse('edit_howdescription'))
                .addFields(
                    {
                        name: localize.parse('edit_howintrotitle'),
                        value: localize.parse('edit_howintrotext')
                    },
                    {
                        name: localize.parse('edit_howstarttitle'),
                        value: localize.parse('edit_howstarttext')
                    },
                );

            message.channel.send(embed);
        } else if (args[0] === 'intro') {
            if (!args[1]) {
                message.channel.send(localize.parse('edit_introtext'));
            } else if (args[1] === 'image') {
                message.channel.send(localize.parse('edit_introimage'));
            } else {
                message.reply(localize.parse('edit_introerror'));
            }
        }
    }
}
