module.exports = async (client, messageReaction, user) => {
    const emoji = messageReaction.emoji.name;
    const member = await messageReaction.message.guild.fetchMember(user);
    const userRoles = member.roles;
    const channel = messageReaction.message.channel;

    const serverLogsChannel = (client.config.currentServer == "live" ? messageReaction.message.guild.channels.find("id", client.config.COGAdminLogChannel) : messageReaction.message.guild.channels.find("id", client.config.COGTestAdminLogChannel));
    const serverWelcomeChannel = (client.config.currentServer == "live" ? messageReaction.message.guild.channels.find("id", client.config.COGWelcomeChannel) : messageReaction.message.guild.channels.find("id", client.config.COGTestWelcomeChannel));

    if (messageReaction.message.id == client.config.COGRoleMessage  || messageReaction.message.id == client.config.COGTestRoleMessage) {
        client.logger.log(`Reaction "${messageReaction.emoji.name}" is added to the role message by user "${user.tag}".`);

        if (emoji == "iagree") {
            if (!userRoles.find(r => r.name === "Friends")) {
                member.addRole((client.config.currentServer == "live" ? client.config.COGFriendsRoleID : client.config.COGTestFriendsRoleID)).catch((err) => console.error(err));

                const msg = await channel.send(`${user}: Thank you for agreeing to the server rules.`);
                await serverLogsChannel.send(`${user}: has agreed to the server rules.`);

                setTimeout(() => {
                    msg.delete();
                }, 5000);

                postWelcome(client, member, serverWelcomeChannel);
            }
        } else {
            if (userRoles.find(r => r.name === "Friends")) {
                client.logger.log("Rules have been agreed to. CONTINUING");
            } else {
                client.logger.log("Rules have NOT been agreed to. STOPPING");
                return;
            }

            if (emoji == "Anthem") {
                await giveRole(client, member, user, (client.config.currentServer == "live" ? client.config.COGTestAnthemRoleID : client.config.COGTestAnthemRoleID), "Anthem", channel);
            } else if (emoji == "Apex_legends") {
                await giveRole(client, member, user, (client.config.currentServer == "live" ? client.config.COGApexRoleID : client.config.COGTestApexRoleID), "Apex Legends", channel);
            } else if (emoji == "DestinyTwo") {
                await giveRole(client, member, user, (client.config.currentServer == "live" ? client.config.COGDestinyRoleID : client.config.COGTestDestinyRoleID), "Destiny 2", channel);
            } else if (emoji == "MonsterHunter") {
                await giveRole(client, member, user, (client.config.currentServer == "live" ? client.config.COGMonsterHunterRoleID : client.config.COGTestMonsterHunterRoleID), "Monster Hunter", channel);
            } else if (emoji == "OTHERGAMES") {
                await giveRole(client, member, user, (client.config.currentServer == "live" ? client.config.COGOtherGamesRoleID : client.config.COGTestOtherGamesRoleID), "OTHER GAMES", channel);
            } else if (emoji == "Overwatch") {
                await giveRole(client, member, user, (client.config.currentServer == "live" ? client.config.COGOverwatchRoleID : client.config.COGTestOverwatchRoleID), "Overwatch", channel);
            } else if (emoji == "RainbowSixSiege") {
                await giveRole(client, member, user, (client.config.currentServer == "live" ? client.config.COGRainbowSixSiegeRoleID : client.config.COGTestRainbowSixSiegeRoleID), "Rainbow Six: Siege", channel);
            } else if (emoji == "Titanfall2") {
                await giveRole(client, member, user, (client.config.currentServer == "live" ? client.config.COGTitanfallRoleID : client.config.COGTestTitanfallRoleID), "Titanfall 2", channel);
            } else if (emoji == "Warframe") {
                await giveRole(client, member, user, (client.config.currentServer == "live" ? client.config.COGWarframeRoleID : client.config.COGTestWarframeRoleID), "Warframe", channel);
            } else if (emoji == "seeall") {
                await giveRole(client, member, user, (client.config.currentServer == "live" ? client.config.COGSeeAllRoleID : client.config.COGTestSeeAllRoleID), "See All", channel)
            } else {
                // Unable to handle emoji. Delete it here.
            }
        }
    }




};

async function giveRole(client, member, user, role, roleFriendly, channel) {
    member.addRole(role).catch((err) => console.error(err));

    client.logger.log(`Added "${roleFriendly}" role to "${user.tag}".`);
    const msg = await channel.send(`${user}: ${roleFriendly} role has been granted.`);
    
    setTimeout(() => {
        msg.delete();
    }, 5000);

}

async function postWelcome(client, member, channel) {
    let memberAvatar = member.user.avatarURL;
    if (!memberAvatar) {
        memberAvatar = "https://cdn.discordapp.com/embed/avatars/0.png"
    }

    const embed = {
        "title": "Welcome to COG!",
        "color": 3931206,
        "footer": {
          "text": `Roles: ${member.roles.map(r => `${r.name}`).join(' | ')}`
        },
        "thumbnail": {
          "url": `${memberAvatar}`
        },
        "author": {
          "name": `${member.displayName}`,
          "icon_url": `${memberAvatar}`
        }
      };

    setTimeout(() => {
        client.logger.log("Woke up after 60 seconds");
        channel.send({ embed }).then((message) => message.react("👋"));
    }, 60000);
}