module.exports = async (client, message) => {
    if (message.author.bot) return;
    if (message.content.indexOf(client.config.prefix) == 0) return;
    
    if (client.config.currentServer == "live") {
        if (message.channel.id == client.config.COGRoleChannel) return;
    } else if (client.config.currentServer == "testing") {
        if (message.channel.id == client.config.COGTestRoleChannel) return;
    }
    
    const serverLogsChannel = message.guild.channels.find(channel => channel.name === "delete_log");

    if (!serverLogsChannel) {
        return client.logger.error('The logs channel could not be found!');
    }

    const entry = await message.guild.fetchAuditLogs({type: 'MESSAGE_DELETE'}).then(audit => audit.entries.first())
    let user;

    if ((entry.extra.channel.id === message.channel.id) && (entry.target.id === message.author.id) && (entry.createdTimestamp > (Date.now() - 5000)) && (entry.extra.count >= 1)) {
            user = entry.executor.tag
        } else {
            user = message.author.tag
        }

    let messageClean = message.cleanContent;
    messageClean = messageClean.substring(messageClean.indexOf(" ") + 1);
    messageClean = messageClean.split("`").join("'");
    
    if (!messageClean == '') {
        serverLogsChannel.send(`==========
A message was deleted in ${message.channel} by ${user}.
Author: ${message.author.tag}
Content: \`\`\`${messageClean}\`\`\``);
    }
}