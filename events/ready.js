module.exports = (client) => {
    client.logger.ready(`Ready to serve in ${client.channels.size} channels on ${client.guilds.size} servers, for a total of ${client.users.size} users.`);

    client.db.defaults({ logs: [], count: 0, streamers: [] }).write();

    var streamers = client.db.get('streamers').value();
    setInterval(() => {client.db.read(); streamers = client.db.get('streamers').value();}, fivemins)
    //console.log(streamers);

    checkHelix(client, streamers);
    setInterval(() => { checkHelix(client, streamers); }, fivemins);

}


//const streamers = client.db.get('streamers').value();
//console.log(streamers);


const TwitchHelix = require('twitch-helix');
const fivemins = (5*60*1000);

const liveStreams = []; // {username, lastSeen}

const twitchAPI = new TwitchHelix({
    clientId: 'vf29iu5i7nkwhx1ij8i0awxj02sxbz',
    clientSecret: 'hfbkmr6pvh9g34t8elcx1n4v113rsj'
});

const checkHelix = async (client, streamers) => {
    const activeServer = (client.config.currentServer == "live" ? client.guilds.get(client.config.COGServer) : client.guilds.get(client.config.COGTestServer));

    const streamAnnounceChannel = activeServer.channels.find(channel => channel.name === "stream_announcements");
    if (!streamAnnounceChannel) {
        return client.logger.error('The logs channel could not be found!');
    }

    //const streamers = ['Rand0mcraft', 'Geisensei', 'Callsign_matora', 'Cameron_oz93', 'Gradi3nt', 'Thespectar', 
    //                    'Shifty_nath', 'Te_aoterra', 'Emoir', 'Empresssteak', 'Lady_la6yrinth', 'Izou_', 'Nublet_99', 'SierraPresents'];


    results = await twitchAPI.sendHelixRequest(`streams?user_login=${streamers.join('&user_login=')}`);

    let now = Date.now();

    // Loop through newly found live streams.
    results.forEach(async streamer => {
        //console.log(streamer);
        if (streamer.type == 'live' && (now - new Date(streamer.started_at).getTime()) >= 2*60*1000) {
            let liveStream = liveStreams.find(o => o.username === streamer.user_name);
            if (liveStream) {
                liveStream.lastSeen = now;

            } else {
                liveStreams.push({ username: streamer.user_name, lastSeen: now });
                client.logger.log(`${streamer.user_name} went live!`);

                //get game name
                var gameInfo = await twitchAPI.sendHelixRequest(`games?id=${streamer.game_id}`);
                var gameName;
                //console.log(gameInfo);

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
				client.logger.log(`${streamer.user_name} stream has been live for 5 minutes. Posting`);
                streamAnnounceChannel.send(`Hey everyone, ${streamer.user_name} went live! Check them out at https://twitch.tv/${streamer.user_name}/ `, { embed });

            }
        }
    });

    for(let i = 0; i < (liveStreams.length); i++) {
        let streamer = liveStreams[i];
        let result = results.find(o => o.user_name === streamer.username);
        if (!result && (now - streamer.lastSeen) >= (fivemins) ) {
            // Stream offline
            liveStreams.splice(i,1);
            client.logger.log(`${streamer.username} went offline.`);
        }
    }
}