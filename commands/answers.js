module.exports = {
    name: 'answers',
    description: 'Checks responses sent in private.',
    execute(message, args) {
        message.react(`👁`);
    }
}
