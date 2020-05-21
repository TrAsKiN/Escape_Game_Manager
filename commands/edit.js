const Discord = require('discord.js');

module.exports = {
    name: 'edit',
    description: 'Allows an administrator to edit the game settings.',
    usage: '<parameter> <value>',
    guildOnly: true,
    aliases: ['set'],
    public: true,
    permissions: [
        'MANAGE_ROLES'
    ],
    execute(message, args) {
        if (!args[0]) {
            const embed = new Discord.MessageEmbed()
                .setTitle('How to edit a game')
                .setDescription('Here are the different steps to follow to edit your game.')
                .addFields(
                    {
                        name: `Define the number of steps`,
                        value: `Set the number of steps you want in your game by typing the command:\n**!edit step *X*** (***X*** being the desired number of steps)`
                    },
                    {
                        name: `And finally...`,
                        value: `Type **!start** to play the game!`
                    },
                );

            message.channel.send(embed);
        } else if (args[0] === 'step') {
            if (!args[1] || isNaN(args[1])) {
                message.reply(`you have not given a value or the value is not a number!`);
            } else {
                message.channel.send(`You have defined ${args[1]} steps for your game.`);
            }
        }
    }
}
