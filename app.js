const fs = require('fs');
const Discord = require('discord.js');
const { Sequelize } = require('sequelize');
const Localization = require('./Localization.js');

const { prefix, token, locale } = require('./config.json');

const client = new Discord.Client();
const localize = new Localization(locale);

client.models = new Discord.Collection();

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});

client.models.set('Users', sequelize.import('models/Users'));
client.models.set('Games', sequelize.import('models/Games'));
client.models.set('Progress', sequelize.import('models/Progress'));
client.models.set('Puzzles', sequelize.import('models/Puzzles'));

client.models.get('Games').hasOne(client.models.get('Users'), {foreignKey: 'active_game'});
client.models.get('Games').hasOne(client.models.get('Progress'), {foreignKey: 'game'});
client.models.get('Progress').hasMany(client.models.get('Users'), {foreignKey: 'progress'});
client.models.get('Puzzles').hasOne(client.models.get('Progress'), {foreignKey: 'puzzle'});

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', () => {
    sequelize.sync();
    client.user.setActivity(`${prefix}help`, { type: 'LISTENING' })
        .then(() => {
            console.log(`${client.user.username} is ready!`);
        });
});

client.on('message', message => {
    if ((!message.content.startsWith(prefix) && message.channel.type === 'text') || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName) && message.channel.type !== 'dm') return;

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))
        || client.commands.get('answers');

    if (!command) return;

    if (command.guildOnly && message.channel.type !== 'text') {
        return message.reply(localize.parse('general_notDm'));
    }

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply(localize.parse('general_error'));
    }
});

client.login(token);
