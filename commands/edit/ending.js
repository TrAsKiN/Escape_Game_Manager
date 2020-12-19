const { Op } = require('sequelize');
const { MessageAttachment } = require("discord.js");

module.exports = {
    name: 'ending',
    execute(message, args, localize) {
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
            message.channel.send(localize.parse('edit_endingImage'))
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
                                        image: messages.first().content
                                    }
                                }).then(([ending, created]) => {
                                    if (!created) {
                                        if (ending.puzzle === null) {
                                            return ending.update({image: messages.first().content});
                                        } else {
                                            return message.client.models.get('Progress').create({
                                                game: game.id,
                                                index: ending.index + 1,
                                                image: messages.first().content
                                            }).then(newEnding => {
                                                ending = newEnding;
                                            });
                                        }
                                    } else {
                                        return ending;
                                    }
                                }).then(ending => {
                                    const attachment = new MessageAttachment(ending.image);
                                    message.channel.send(localize.parse('edit_endingImageChanged'), attachment);
                                });
                            });
                        })
                        .catch((error) => {
                            console.log(error);
                            message.channel.send(localize.parse('edit_imageError'));
                        });
                });
        } else {
            message.reply(localize.parse('edit_endingError'));
        }
    }
}
