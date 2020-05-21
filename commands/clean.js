module.exports = {
    name: 'clean',
    description: 'Allows you to delete between 1 and 99 old messages.',
    usage: '<number>',
    guildOnly: true,
    aliases: ['clear'],
    public: true,
    permissions: [
        'MANAGE_MESSAGES'
    ],
    execute(message, args) {
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
    }
}
