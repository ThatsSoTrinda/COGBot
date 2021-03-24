module.exports = async (client, messageReaction, user) => {
    const emoji = messageReaction.emoji.name;
    const member = await messageReaction.message.guild.fetchMember(user);
    const channel = messageReaction.message.channel;
    const serverLogsChannel = (client.config.currentServer == "live" ? messageReaction.message.guild.channels.find("id", client.config.COGAdminLogChannel) : messageReaction.message.guild.channels.find("id", client.config.COGTestAdminLogChannel));

    if (messageReaction.message.id == client.config.COGRoleMessage || messageReaction.message.id == client.config.COGTestRoleMessage) {
        client.logger.log(`Reaction "${messageReaction.emoji.name}" is removed from the role message by user "${user.tag}".`);

        if (emoji == "iagree") {
            // They tried to unagree to the rules!
            const msg = await channel.send(`${user}: You can't unagree to the rules!`);
            serverLogsChannel.send(`${user}: has attempted to unagree to the rules!`);
            setTimeout(() => {
                msg.delete();
            }, 5000);
        } else if (emoji == "Anthem") {
            await takeRole(client, member, user, (client.config.currentServer == "live" ? client.config.COGTestAnthemRoleID : client.config.COGTestAnthemRoleID), "Anthem", channel);
        } else if (emoji == "Apex_legends") {
            await takeRole(client, member, user, (client.config.currentServer == "live" ? client.config.COGApexRoleID : client.config.COGTestApexRoleID), "Apex Legends", channel);
        } else if (emoji == "DestinyTwo") {
            await takeRole(client, member, user, (client.config.currentServer == "live" ? client.config.COGDestinyRoleID : client.config.COGTestDestinyRoleID), "Destiny 2", channel);
        } else if (emoji == "MonsterHunter") {
            await takeRole(client, member, user, (client.config.currentServer == "live" ? client.config.COGMonsterHunterRoleID : client.config.COGTestMonsterHunterRoleID), "Monster Hunter", channel);
        } else if (emoji == "OTHERGAMES") {
            await takeRole(client, member, user, (client.config.currentServer == "live" ? client.config.COGOtherGamesRoleID : client.config.COGTestOtherGamesRoleID), "OTHER GAMES", channel);
        } else if (emoji == "Overwatch") {
            await takeRole(client, member, user, (client.config.currentServer == "live" ? client.config.COGOverwatchRoleID : client.config.COGTestOverwatchRoleID), "Overwatch", channel);
        } else if (emoji == "RainbowSixSiege") {
            await takeRole(client, member, user, (client.config.currentServer == "live" ? client.config.COGRainbowSixSiegeRoleID : client.config.COGTestRainbowSixSiegeRoleID), "Rainbow Six: Siege", channel);
        } else if (emoji == "Titanfall2") {
            await takeRole(client, member, user, (client.config.currentServer == "live" ? client.config.COGTitanfallRoleID : client.config.COGTestTitanfallRoleID), "Titanfall 2", channel);
        } else if (emoji == "Warframe") {
            await takeRole(client, member, user, (client.config.currentServer == "live" ? client.config.COGWarframeRoleID : client.config.COGTestWarframeRoleID), "Warframe", channel);
        } else if (emoji == "seeall") {
            await takeRole(client, member, user, (client.config.currentServer == "live" ? client.config.COGSeeAllRoleID : client.config.COGTestSeeAllRoleID), "See All", channel)
        }
    }
}

async function takeRole(client, member, user, role, roleFriendly, channel) {
    member.removeRole(role).catch((err) => console.error(err));

    client.logger.log(`Removed "${roleFriendly}" role from "${user.tag}".`);
    const msg = await channel.send(`${user}: ${roleFriendly} role has been removed.`);
    setTimeout(() => {
        msg.delete();
    }, 5000);
}
