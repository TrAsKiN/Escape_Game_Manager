const Localization = require('../Localization.js');
const { locale } = require('../config.json');
const localize = new Localization(locale);

module.exports = {
    name: 'start',
    description: localize.parse('start_description'),
    guildOnly: true,
    public: true,
    execute(message, args) {
        message.react(`🏁`);
        message.reply(localize.parse('start_gamestarted'));
    }
}
