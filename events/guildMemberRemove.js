module.exports = async (client, member) => {
    const serverLogsChannel = member.guild.channels.find(channel => channel.name === "server_logs");

    if (!serverLogsChannel) {
        return client.logger.error('The logs channel could not be found!');
    }

    serverLogsChannel.send(`${member.user.tag}: has left the server. (#${member.user.id})`);
}