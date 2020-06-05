const Localization = require('../Localization.js');
const { prefix, locale } = require('../config.json');
const localize = new Localization(locale);

module.exports = {
	name: 'help',
	description: localize.parse('help_description'),
	aliases: ['commands'],
	usage: '<command>',
    guildOnly: true,
    public: true,
    permissions: [
        'MANAGE_ROLES'
    ],
	execute(message, args) {
        const data = [];
        const { commands } = message.client;

        if (!args.length) {
            data.push(localize.parse('help_listing'));
            data.push(commands.filter(command => command.public).map(command => command.name).join(', '));
            data.push('\n'+ localize.parse('help_usage', { "%help_command%": `${prefix}help` }));

            return message.author.send(data, { split: true })
                .then(() => {
                    if (message.channel.type === 'dm') return;
                    message.reply(localize.parse('help_sendDm'));
                })
                .catch(error => {
                    console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                    message.reply(localize.parse('help_dmDisabled'));
                });
        }

        const name = args[0].toLowerCase();
        const command = commands.find(c => c.name === name && c.public) || commands.find(c => c.aliases && c.aliases.includes(name) && c.public);

        if (!command) {
            return message.reply(localize.parse('help_notValid'));
        }

        data.push(localize.parse('help_commandName', { "%command_name%": command.name }));

        if (command.aliases) data.push(localize.parse('help_commandAliases', { "%command_aliases%": command.aliases.join(', ') }));
        if (command.description) data.push(localize.parse('help_commandDescription', { "%command_description%": command.description }));
        if (command.usage) data.push(localize.parse('help_commandUsage', { "%command_usage%": `${prefix}${command.name} ${command.usage}` }));

        message.channel.send(data, { split: true });
    },
};
