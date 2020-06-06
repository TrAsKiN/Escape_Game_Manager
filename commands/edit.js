const Discord = require('discord.js');
const { Op } = require('sequelize');
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
                message.channel.send(localize.parse('edit_introText'))
                    .then(() => {
                        message.channel.awaitMessages(m => message.author.id === m.author.id, { max: 1 })
                            .then(messages => {
                                message.client.models.get('Games').findOrCreate({
                                    where: {guild_id: message.channel.guild.id},
                                    defaults: {guild_id: message.channel.guild.id}
                                }).then(([game]) => {
                                    message.client.models.get('Progress').findOrCreate({
                                        where: {game: game.id, index: 0},
                                        defaults: {game: game.id, index: 0, text: messages.first().content}
                                    }).then(([intro, created]) => {
                                        if (!created) {
                                            intro.update({text: messages.first().content});
                                        }
                                        message.channel.send(localize.parse('edit_introTextChanged', {'%intro_text%': intro.text}));
                                    });
                                });
                            })
                            .catch((error) => {
                                console.log(error);
                                message.channel.send(localize.parse('edit_textError'));
                            });
                    });
            } else if (args[1] === 'image') {
                message.channel.send(localize.parse('edit_introImage'));
            } else {
                message.reply(localize.parse('edit_introError'));
            }
        } else if (args[0] === 'ending') {
            if (!args[1]) {
                message.channel.send(localize.parse('edit_endingText'))
                    .then(() => {
                        message.channel.awaitMessages(m => message.author.id === m.author.id, { max: 1 })
                            .then(messages => {
                                message.client.models.get('Games').findOrCreate({
                                    where: {guild_id: message.channel.guild.id},
                                    defaults: {guild_id: message.channel.guild.id}
                                }).then(([game]) => {
                                    message.client.models.get('Progress').findOrCreate({
                                        where: {game: game.id, index: {[Op.gt]: 0}},
                                        order: [
                                            ['index', 'DESC']
                                        ],
                                        defaults: {
                                            game: game.id,
                                            index: 1,
                                            text: messages.first().content
                                        }
                                    }).then(([ending, created]) => {
                                        if (!created) {
                                            if (ending.puzzle === null) {
                                                return ending.update({text: messages.first().content});
                                            } else {
                                                return message.client.models.get('Progress').create({
                                                    game: game.id,
                                                    index: ending.index + 1,
                                                    text: messages.first().content
                                                }).then(newEnding => {
                                                    ending = newEnding;
                                                });
                                            }
                                        } else {
                                            return ending;
                                        }
                                    }).then(ending => {
                                        message.channel.send(localize.parse('edit_endingTextChanged', {'%ending_text%': ending.text}));
                                    });
                                });
                            })
                            .catch((error) => {
                                console.log(error);
                                message.channel.send(localize.parse('edit_textError'));
                            });
                    });
            } else if (args[1] === 'image') {
                message.channel.send(localize.parse('edit_endingImage'));
            } else {
                message.reply(localize.parse('edit_endingError'));
            }
        }
    }
}
