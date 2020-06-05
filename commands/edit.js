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
                .setTitle(localize.parse('edit_howTitle'))
                .setDescription(localize.parse('edit_howDescription'))
                .addFields(
                    {
                        name: localize.parse('edit_howIntroTitle'),
                        value: localize.parse('edit_howIntroText')
                    },
                    {
                        name: localize.parse('edit_howStartTitle'),
                        value: localize.parse('edit_howStartText')
                    },
                );

            message.channel.send(embed);
        } else if (args[0] === 'intro') {
            if (!args[1]) {
                message.channel.send(localize.parse('edit_introText'));
            } else if (args[1] === 'image') {
                message.channel.send(localize.parse('edit_introImage'));
            } else {
                message.reply(localize.parse('edit_introError'));
            }
        }
    }
}
