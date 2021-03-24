module.exports = async (client, guild, user) => {
	const serverLogsChannel = guild.channels.find(channel => channel.name == "server_logs");
	const staffChannel = guild.channels.find(channel => channel.name == "staff_chat");

	if (!serverLogsChannel) {
		return client.logger.error('The logs channel could not be found!');
	}

	if (!staffChannel) {
		return client.logger.error('The staff channel could not be found!');
	}

	const entry = await guild.fetchAuditLogs({ type: 'MEMBER_BAN_ADD' }).then(audit => audit.entries.first())

	const embed = {
		"title": `${entry.target.tag} was banned. (${entry.target.id})`,
		"color": 16711680,
		"footer": {
			"icon_url": `${entry.executor.displayAvatarURL}`,
			"text": `User Banned by ${entry.executor.username}`
		},
		"author": {
			"name": "COGBot Alerts",
			"url": "https://discordapp.com",
			"icon_url": "https://www.nothau.com/cogbot/banicon.png"
		},
		"fields": [
			{
				"name": '**Reason**',
				"value": `${entry.reason}`
			}
		]
	};


	serverLogsChannel.send(`${entry.target}: Has been banned from the server by ${entry.executor.username}. (#${user.id}) 
Reason: ${entry.reason}`);
	staffChannel.send({ embed });

	const count = client.db.get('count').value();
	client.db.get('logs')
		.push({ id: (count + 1), date: Date.now(), username: entry.target.username, userID: user.id, reason: entry.reason, moderator: entry.executor.username })
		.write();

	client.db.update('count', n => n + 1).write();
}