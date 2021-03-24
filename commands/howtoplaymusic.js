exports.run = async (client, message, args) => {
    const musicPMMessage = `**__!🎶| DJ (.howtoplaymusic)__**:
1. Type: **!join** - the bot will join to your current channel (Please use <#257033350487736321>).
2. Type: **!play [URL/song]** - this will add the video to the *!queue*.

                **!djcommands** for more commands.

                            --------
*If bot is too loud just right click it and lower the 'user volume'.*

Still stuck type: *!aliases*.`

    try {
    const msg = await message.channel.send(`${message.author}, instructions on how to play music have been sent to you via Direct Message.`);
    await message.author.send(musicPMMessage);
    setTimeout(() => {
        msg.delete();
        message.delete();
    }, 5000);

    } catch (err) {
        client.logger.error(err);
    }
}