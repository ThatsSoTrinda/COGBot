exports.run = async (client, message, args) => {

    const embed = {
        "title": "Help",
        "description": "Below are a list of commands, and their descriptions:",
        "color": 10916645,

        "fields": [
          {
            "name": ".djcommands",
            "value": "Will PM the user a list of DJ commands."
          },
          {
            "name": ".gethelp",
            "value": "Will ping the Moderators role, requesting assistance."
          },
          {
            "name": ".howtoplaymusic",
            "value": "Will PM the user instructions on how to play music."
          },
          {
            "name": ".invite",
            "value": "Will PM the user a discord invite link to COG."
          },
          {
            "name": ".suggest [suggestion]",
            "value": "Will post [suggestion] in the suggestions channel."
          }
        ]
      };
      message.channel.send({ embed });

};