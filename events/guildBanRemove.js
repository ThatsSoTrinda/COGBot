module.exports = async (client, guild, user) => {
    const serverLogsChannel = guild.channels.find(channel => channel.name === "server_logs");

    if (!serverLogsChannel) {
        return client.logger.error('The logs channel could not be found!');
    }

    const entry = await guild.fetchAuditLogs({type: 'MEMBER_BAN_REMOVE'}).then(audit => audit.entries.first())

    serverLogsChannel.send(`${entry.target}: Has been unbanned from the server by ${entry.executor.username}. (#${user.id})`);
}