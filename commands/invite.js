//const cogLogo = "<:COGlogo:572007852604915717>"


exports.run = async (client, message, args) => {
    const inviteMessage = `So, you want to invite your friends to COG?
We are always happy to have new and friendly faces in ${client.config.cogLogo}.
Before sending them an invite, please ensure they are 16+ (See #rules_and_faq).

Invite link: \`https://discord.gg/6Vnd9MK\`

Thanks for helping grow COG and keeping this community united 👍🏻.`

    try {
    const msg = await message.channel.send(`${message.author}, an invite link has been sent to you via Direct Message.`);
    await message.author.send(inviteMessage);
    setTimeout(() => {
        msg.delete();
        message.delete();
    }, 5000);

    } catch (err) {
        client.logger.error(err);
    }
}