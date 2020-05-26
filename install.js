const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

fs.access('config.json', fs.constants.F_OK, (doesNotExist) => {
    if (doesNotExist) {
        rl.question(`Enter your bot token: `, (answer) => {
            rl.close();

            const config = {
                "prefix": "!",
                "token": `${answer}`,
                "locale": "en"
            };

            fs.writeFile('config.json', JSON.stringify(config), 'utf8', (error) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log(`The config.json file has been created!\n`);
                }
            });
        });
    } else {
        rl.close();
    }
});
