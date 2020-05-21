module.exports = {
    name: 'start',
    description: 'Allows a player to start a game.',
    guildOnly: true,
    public: true,
    execute(message, args) {
        message.react(`🏁`);
        message.reply(`you have chosen to start a game!`);
    }
}
