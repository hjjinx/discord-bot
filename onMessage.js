const fs = require("fs");
const Discord = require("discord.js");
var dispatcher;

module.exports.playSong = message => {
  fs.readdir("D:music", async (err, tempFiles) => {
    if (err) console.error(err);
    const filesLower = [];
    tempFiles.map((file, i) => filesLower.push(file.toLowerCase()));

    const matching = [];
    message.content = message.content.substr(6).toLowerCase();
    for (file of filesLower)
      if (file.includes(message.content)) matching.push(file);

    if (matching.length === 1) {
      if (message.member.voiceChannel) {
        message.member.voiceChannel
          .join()
          .then(connection => {
            dispatcher = connection.playFile(`D:/Music/${matching[0]}`, {
              bitrate: 320000
            });
            dispatcher.on("end", end => {
              message.guild.me.voiceChannel.leave();
            });
            console.log(dispatcher);
            message.channel.send(`Playing ${matching[0]}`);
          })
          .catch(console.log);
      } else message.channel.send("You must Join a Voice Channel First!");
    } else if (matching.length > 1) {
      const embed = new Discord.RichEmbed()
        .setTitle("Songs Found:")
        .setColor(0xff00aa)
        .setDescription(
          "The list of Songs available on my Sensei hjjinx's PC that match your query are:"
        );
      for (let i = 0; i < matching.length; i++) {
        embed.addField(matching[i], "hjjinx Rules!");
      }
      message.channel.send({ embed });
    }
  });
};

module.exports.pauseSong = message => {
  dispatcher.pause();
};

module.exports.resumeSong = message => {
  dispatcher.resume();
};

module.exports.changeVolume = message => {
  const content = parseInt(message.content.substr(8));
  dispatcher.setVolume(content / 50);
  message.channel.send(`Set Volume to ${content}%`);
};
