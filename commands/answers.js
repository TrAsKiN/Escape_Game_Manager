const Localization = require('../Localization.js');
const { locale } = require('../config.json');
const localize = new Localization(locale);

module.exports = {
    name: 'answers',
    description: localize.parse('answers_description'),
    execute(message, args) {
        message.react(`👁`);
    }
}
