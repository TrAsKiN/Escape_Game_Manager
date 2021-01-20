const fs = require('fs');
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
    commands: new Discord.Collection(),
    execute(message, args) {
        const commandFiles = fs.readdirSync('./commands/edit').filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(`./edit/${file}`);
            this.commands.set(command.name, command);
        }

        const command = this.commands.get(args[0]);
        try {
            command.execute(message, args, localize);
        } catch (e) {
            const embed = new Discord.MessageEmbed()
                .setTitle(localize.parse('edit_howTitle'))
                .setDescription(localize.parse('edit_howDescription'))
                .addField(
                    localize.parse('edit_howIntroTitle'),
                    localize.parse('edit_howIntroText')
                )
                .addField(
                    localize.parse('edit_howEndingTitle'),
                    localize.parse('edit_howEndingText')
                )
                .addField(
                    localize.parse('edit_howStartTitle'),
                    localize.parse('edit_howStartText')
                );
            message.channel.send(embed);
        }
    }
}
