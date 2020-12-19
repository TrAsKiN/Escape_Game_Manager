const { MessageAttachment } = require("discord.js");

module.exports = {
    name: 'intro',
    execute(message, args, localize) {
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
            message.channel.send(localize.parse('edit_introImage'))
                .then(() => {
                    message.channel.awaitMessages(m => message.author.id === m.author.id, { max: 1 })
                        .then(messages => {
                            message.client.models.get('Games').findOrCreate({
                                where: {guild_id: message.channel.guild.id},
                                defaults: {guild_id: message.channel.guild.id}
                            }).then(([game]) => {
                                message.client.models.get('Progress').findOrCreate({
                                    where: {game: game.id, index: 0},
                                    defaults: {game: game.id, index: 0, image: messages.first().content}
                                }).then(([intro, created]) => {
                                    if (!created) {
                                        intro.update({image: messages.first().content});
                                    }
                                    const attachment = new MessageAttachment(intro.image);
                                    message.channel.send(localize.parse('edit_introImageChanged'), attachment);
                                });
                            });
                        })
                        .catch((error) => {
                            console.log(error);
                            message.channel.send(localize.parse('edit_imageError'));
                        });
                });
        } else {
            message.reply(localize.parse('edit_introError'));
        }
    }
}
