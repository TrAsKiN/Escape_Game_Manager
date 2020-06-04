const fs = require('fs');

module.exports = class Localization {
    locale;

    constructor(locale) {
        var localesFiles = fs.readdirSync('./locales').filter(file => file.endsWith('.json'));

        if (localesFiles.includes(`${locale}.json`)) {
            this.locale = new Map(Object.entries(require('./locales/'+ localesFiles.find(file => file === `${locale}.json`))));
        } else {
            this.locale = new Map(Object.entries(require('./locales/'+ localesFiles.find(file => file === `en.json`))));
        }
    }

    parse(text, substitutes) {
        const content = this.locale.get(text);

        if (!substitutes) return content;

        const substitutesMap = new Map(Object.entries(substitutes));
        const regex = new RegExp('('+ Object.keys(substitutes).join('|') +')', 'gm');
        
        return content.replace(regex, match => substitutesMap.get(match));
    }
}
