if (Number(process.version.slice(1).split(".")[0]) < 8) throw new Error("Node 8.0.0 or higher is required. Update Node on your system.");

const Discord = require("discord.js");
const client = new Discord.Client();
const Enmap = require('enmap');
const fs = require('fs');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('bans.json');

client.config = require("./config.json");
client.logger = require("./modules/Logger");
client.db = low(adapter);

const init = async () => {

    fs.readdir("./events/", (err, files) => {
        if (err) return client.logger.error(err);
        files.forEach(file => {
            if (!file.endsWith(".js")) return;
            const event = require(`./events/${file}`);
            let eventName = file.split(".")[0];
            client.logger.log(`Loading event: ${eventName}`);
            client.on(eventName, event.bind(null, client));
        });
    });
      
    client.commands = new Enmap();
    
    fs.readdir("./commands/", (err, files) => {
        if (err) return client.logger.error(err);
        files.forEach(file => {
            if (!file.endsWith(".js")) return;
            let props = require(`./commands/${file}`);
            let commandName = file.split(".")[0];
            client.logger.log(`Loading command: .${commandName}`);
            client.commands.set(commandName, props);
        });
    });

    if (client.config.currentServer == "live") {
        client.logger.log('Logging into LIVE server')
        client.login(client.config.token);
    } else if (client.config.currentServer == "testing") {
        client.logger.log('Logging into TESTING server');
        client.login(client.config.testtoken);
    } else {
        client.logger.err('Unable to find a token. Please check config.json');
    }
};

init();