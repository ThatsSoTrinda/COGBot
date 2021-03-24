exports.run = async (client, message, args) => {
    if (message.author.id == client.config.ownerID) {
        process.exit(1);
    }
}