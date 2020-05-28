const fs = require('fs');
const variables = require('./locales/variables.json');

module.exports = class Localization {
    _localesFiles = fs.readdirSync('./locales').filter(file => file.endsWith('.json'));
    _locales = new Map();
    _variables = new Map(Object.entries(variables));
    client;
    locale;

    constructor(client, locale) {
        this.client = client;
        this.locale = locale;

        for (const file of this._localesFiles) {
            const locale = require(`./locales/${file}`);
            this._locales.set(file.split('.').shift(), locale);
        }
    }

    parse(text) {
        var content = new Map(Object.entries(this._locales.get(this.locale))).get(text);
        return content.replace(/(%\w+%)/g, correspondence => {
            if (this._variables.get(correspondence)) {
                return eval(this._variables.get(correspondence));
            }
            return correspondence;
        });
    }
}
