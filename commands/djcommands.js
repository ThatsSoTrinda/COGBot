exports.run = async (client, message, args) => {
    const musicPMMessage = `Here are some useful commands for COG's **DJ Bots**

Rythm has every command you need to have a great music experience, these include:
                            -----------------------------
**play**     Plays a song with the given name or url.
**disconnect**     Disconnect the bot from the voice channel it is in.
**np**     Shows what song the bot is currently playing.
**aliases**     List command aliases.
**skip**     Skips the currently playing song.
**seek**     Seeks to a certain point in the current track.
**soundcloud**     Searches soundcloud for a song.
**search**     Searches YouTube for results of a URL.
**loop**     Loop the currently playing song.
**join**     Summons the bot to your voice channel.
**lyrics**     Gets the lyrics of the current playing song.
**resume**     Resume paused music.
**skipto**     Skips to a certain position in the queue.
**clear**     Clears the queue.
**replay**     Reset the progress of the current song
**pause**     Pauses the currently playing track.
**removedupes**     Removes duplicate songs from the queue.
**playtop**     Like the play command, but queues from the top.
**shuffle**     Shuffles the queue.
**queue**     View the queue. To view different pages, type the command with the specified page number after it (queue 2).

                            -----------------------------
For *OTHER* DJ Commands you can find them by typing: \`!aliases\`

**__NOTE__** *some commands require **DJ** role. These will be given to certain members and regular __trusted__ users* 😉.`

    try {
    const msg = await message.channel.send(`${message.author}, a list of DJ Commands have been sent to you via Direct Message.`);
    await message.author.send(musicPMMessage);
    setTimeout(() => {
        msg.delete();
        message.delete();
    }, 5000);

    } catch (err) {
        client.logger.error(err);
    }
}