const fs = require('fs');

module.exports = class Localization {
    localesFiles = fs.readdirSync('./locales').filter(file => file.endsWith('.json'));
    locales = new Map();
    locale;

    constructor(locale) {
        this.locale = locale || `en`;

        for (const file of this.localesFiles) {
            const locale = require(`./locales/${file}`);
            this.locales.set(file.split('.').shift(), locale);
        }
    }

    parse(text, substitut) {
        var content = new Map(Object.entries(this.locales.get(this.locale))).get(text);
        if (substitut) {
            return content.replace(/(%\w+%)/, substitut);
        }
        return content;
    }
}
