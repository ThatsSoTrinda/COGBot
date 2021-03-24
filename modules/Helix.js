const TwitchHelix = require('twitch-helix');
const twitchAPI = new TwitchHelix({
    clientId: 'vf29iu5i7nkwhx1ij8i0awxj02sxbz',
    clientSecret: 'hfbkmr6pvh9g34t8elcx1n4v113rsj'
});
const liveStreams = []; // {username, lastSeen}

function mins(minsIn) {
    return ((minsIn)*60*1000);
}

const checkHelix = async (client, streamers) => {
    const cog = client.guilds.get(client.config.COGServer);

    const streamAnnounceChannel = cog.channels.find(channel => channel.name === "stream_announcements");
    if (!streamAnnounceChannel) {
        return client.logger.error('The logs channel could not be found!');
    }

    results = await twitchAPI.sendHelixRequest(`streams?user_login=${streamers.join('&user_login=')}`);

    let now = Date.now();

    // Loop through newly found live streams.
    results.forEach(async streamer => {
        console.log(streamer);
        if (streamer.type == 'live' && (now - new Date(streamer.started_at).getTime()) >= mins(2)) {
            let liveStream = liveStreams.find(o => o.username === streamer.user_name);
            if (liveStream) {
                liveStream.lastSeen = now;

            } else {
                liveStreams.push({ username: streamer.user_name, lastSeen: now });
                client.logger.log(`${streamer.user_name} went live!`);

                var gameInfo = await twitchAPI.sendHelixRequest(`games?id=${streamer.game_id}`);
                var gameName;

                gameInfo.forEach(game => {
                    gameName = game.name;
                })

                var userAvatar;

                var users = await twitchAPI.sendHelixRequest(`users?login=${streamer.user_name}`);
                users.forEach(user => {
                    userAvatar = user.profile_image_url;
                })


                var thumbURL = streamer.thumbnail_url.replace('{width}', '320').replace('{height}', '180');

                const embed = {
                    "title": `${streamer.title}`,
                    "url": `https://twitch.tv/${streamer.user_name}`,
                    "color": 9648877,
                    "thumbnail": {
                      "url": `${userAvatar}`
                    },
                    "image": {
                      "url": `${thumbURL}`
                    },
                    "author": {
                      "name": `${streamer.user_name}`,
                      "icon_url": `${userAvatar}`
                    },
                    "fields": [
                      {
                        "name": "Game",
                        "value": `${gameName}`,
                        "inline": true
                      },
                      {
                        "name": "Viewers",
                        "value": `${streamer.viewer_count}`,
                        "inline": true
                      }
                    ]
                  };

                streamAnnounceChannel.send(`Hey everyone, ${streamer.user_name} went live! Check them out at https://twitch.tv/${streamer.user_name}/ `, { embed });

            }
        }
    });

    for(let i = 0; i < (liveStreams.length); i++) {
        let streamer = liveStreams[i];
        let result = results.find(o => o.user_name === streamer.username);
        if (!result && (now - streamer.lastSeen) >= (mins(5)) ) {
            // Stream offline
            liveStreams.splice(i,1);
            client.logger.log(`${streamer.username} went offline.`);
        }
    }
}

module.exports = checkHelix;