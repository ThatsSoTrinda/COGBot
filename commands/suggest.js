exports.run = async (client, message, args) => {
    const suggestionChannel = message.guild.channels.find(channel => channel.name === "suggestions");

    if (!suggestionChannel) { return client.logger.error('The suggestions channel could not be found!')}

    if (message.channel != suggestionChannel) {
        const msg = await message.channel.send(`${message.author}, this is not the suggestions channel.`);
        setTimeout(() => {
            msg.delete();
            message.delete();
        }, 5000);
        return;
    }

    if (args == "") {
        try {
            const msg = await message.channel.send(`${message.author}, you have not entered a suggestion. 
Try again with \`.suggest [Your suggestion here]\``);
            setTimeout(() => {
                msg.delete();
                message.delete();
            }, 5000);
        } catch (error) {
            client.logger.error(error);
        }

        return;
    }

    let suggestion = message.cleanContent;
    suggestion = suggestion.substring(suggestion.indexOf(" ") + 1);
    suggestion = suggestion.split("`").join("'");
    try {
        const msg = await message.channel.send(`${message.author} has suggested:
\`\`\`${suggestion}\`\`\`
To make your own suggestion, type \`.suggest [Your suggestion here.]\`.

Please click the reaction below to vote.`);
        await msg.react("👍");
        await msg.react("👎");
    } catch (error) {
        client.logger.error(error);
    }
    setTimeout(() => {
        message.delete();
    }, 5000);
};