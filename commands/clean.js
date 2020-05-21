module.exports = {
    name: 'clean',
    description: 'Allows you to delete between 1 and 99 old messages.',
    usage: '<number>',
    guildOnly: true,
    aliases: ['clear'],
    execute(message, args) {
        if (message.member.hasPermission('MANAGE_MESSAGES')) {
            let amount = parseInt(args[0]) + 1;

            if (isNaN(amount)) {
                amount = 100;
            } else if (amount <= 1 || amount > 100) {
                return message.reply(`you need to input a number between 1 and 99.`);
            }

            message.channel.bulkDelete(amount, true)
                .catch(error => {
                    console.error(error);
                    message.channel.send(`there was an error trying to delete messages in this channel!`);
                });
        } else {
            return message.reply(`you don't have the rights to delete posts on this channel.`);
        }
    }
}
