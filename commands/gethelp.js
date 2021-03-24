exports.run = async (client, message, args) => {
    try {
        const msg = await message.channel.send(`❓ ❓ ❓ ❓ ❓ ❓ ❓ ❓ ❓
I'll call for help for you 😉

*In the meantime if you haven't posted your* **Question/Problem** *please do so now!*

${message.author} would like some help <@&181980396542492683> ⚠`);
    } catch (err) {
        client.logger.error(err);
    }
}