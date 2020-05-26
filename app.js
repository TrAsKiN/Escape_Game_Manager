const fs = require('fs');
const Discord = require('discord.js');
const Localization = require('./Localization.js');

const { prefix, token, locale } = require('./config.json');

const localize = new Localization(locale);
const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', () => {
    client.user.setPresence({ activity: { name: `${prefix}help`, type: 'LISTENING' } })
        .then(() => {
            console.log(localize.parse('system_ready', client.user.username));
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
        return message.reply(localize.parse('general_notdm'));
    }

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply(localize.parse('general_error'));
    }
});

client.login(token);
