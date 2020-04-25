const fs = require("fs");
const Discord = require("discord.js");
var dispatcher; // Voice Dispatcher of the song currently playing
var collector; // Reaction collector to the song playing
var song; // Current Playing song message

var queue = {};
var dispatchers = {};

module.exports.pauseSong = async (message) => {
  const guildId = message.channel.guild.id;
  if (song) {
    song.content = song.content.split(`\`\``);
    if (!dispatchers[guildId].paused) {
      await dispatchers[guildId].pause();
      song.content[3] = "Paused";
    }
    song.content = song.content.join(`\`\``);
    song.edit(song.content);
    message.delete();
  }
};

module.exports.resumeSong = async (message) => {
  const guildId = message.channel.guild.id;
  if (song) {
    song.content = song.content.split(`\`\``);
    if (dispatchers[guildId].paused) {
      await dispatchers[guildId].resume();
      song.content[3] = "Playing";
    }
    song.content = song.content.join(`\`\``);
    song.edit(song.content);
    message.delete();
  }
};

module.exports.changeVolume = (message) => {
  const guildId = message.channel.guild.id;
  const content = parseInt(message.content.substr(8));
  if (Number.isNaN(content) || content > 100 || content < 0) {
    message.reply(`Volume must be between 0 and 100`);
    return;
  }
  dispatchers[guildId].setVolume(content / 100);
  if (song.content) {
    song.content = song.content.split(`\`\``);
    song.content[1] = `${dispatchers[guildId].volume * 100}%`;
    song.content = song.content.join(`\`\``);
    song.edit(song.content);
  }
  message.delete();
};

module.exports.leaveChannel = (message) => {
  const guildId = message.channel.guild.id;
  if (message.guild.me.voice.channel && dispatchers[guildId]) {
    dispatchers[guildId].end();
    message.guild.me.voice.channel.leave();
  }
  message.delete();
};

module.exports.mute = (message) => {
  const guildId = message.channel.guild.id;
  if (song && dispatchers[guildId]) {
    dispatchers[guildId].setVolume(0);
    song.content = song.content.split(`\`\``);
    song.content[3] = "Muted";
  }
  song.content = song.content.join(`\`\``);
  song.edit(song.content);
  message.delete();
};

module.exports.streamAfterHours = (message) => {
  queue[message.channel.guild.id] = [
    {
      url: "https://www.youtube.com/watch?v=ygTZZpVkmKg",
      title: "The Weeknd - After Hours (Audio)",
    },
    {
      url: "https://www.youtube.com/watch?v=E3QiD99jPAg",
      title: "The Weeknd - In Your Eyes (Audio)",
    },
    {
      url: "https://www.youtube.com/watch?v=RcS_8-a-sMg",
      title: "The Weeknd - Faith (Audio)",
    },
    {
      url: "https://www.youtube.com/watch?v=u6lihZAcy4s",
      title: "The Weeknd - Save Your Tears (Audio)",
    },
    {
      url: "https://www.youtube.com/watch?v=UxPEFFHA4xw",
      title: "The Weeknd - Snowchild (Audio)",
    },
    {
      url: "https://www.youtube.com/watch?v=fHI8X4OXluQ",
      title: "The Weeknd - Blinding Lights (Official Audio)",
    },
    {
      url: "https://www.youtube.com/watch?v=-uj9b9JCIJM",
      title: "The Weeknd - Heartless (Official Audio)",
    },
  ];
  playStream("next", message);
};

const skip = async (message) => {
  const guildId = message.channel.guild.id;
  if (queue[guildId] && queue[guildId][0]) {
    queue[guildId].shift();
    if (message.guild.me.voice.channel) {
      if (song.content && dispatchers[guildId]) {
        song.content = song.content.split(`\`\``);
        song.content[3] = "Skipped";
      }
      song.content = song.content.join(`\`\``);
      await song.edit(song.content);
    }
    playStream("next", message);
  }
};

module.exports.skip = skip;

module.exports.stopSong = (message) => {
  const guildId = message.channel.guild.id;
  delete queue[guildId];
  if (message.guild.me.voice.channel) {
    if (song.content && dispatchers[guildId]) {
      song.content = song.content.split(`\`\``);
      song.content[3] = "Stopped";
    }
    song.content = song.content.join(`\`\``);
    song.edit(song.content);
    dispatchers[guildId].end();
    message.delete();
  }
};

module.exports.displayQueue = (message) => {
  const guildId = message.channel.guild.id;
  if (queue[guildId]) {
    if (!queue[guildId][0]) message.channel.send("The queue is empty!");
    else {
      const embed = new Discord.MessageEmbed()
        .setColor(0xfd0016)
        .setTitle("Items in queue: ");
      for (let i = 0; i < queue[guildId].length; i++) {
        embed.addField(
          `${i + 1}: ${queue[guildId][i].title}`,
          queue[guildId][i].url
        );
      }
      message.channel.send({ embed });
    }
  }
};

module.exports.streamSong = async (message) => {
  const guildId = message.channel.guild.id;
  if (message.member.voice.channel) {
    let url = message.content.substr(8);
    const ytdl = require("ytdl-core");
    if (url.startsWith("http")) {
      await playStream(url, message);
      return;
    }
    // If not a url, then search for the song on YouTube using youtubeApi.js
    const yt = require("./youtubeApi");
    let urlArr = await yt.search(url);
    const embed = new Discord.MessageEmbed()
      .setColor(0xfd0016)
      .setTitle("Search Results Found: ");
    for (let i = 0; i < urlArr.length; i++) {
      embed.addField(
        `${i + 1}: ${urlArr[i].title}`,
        `https://youtube.com${urlArr[i].href}`
      );
    }
    message.channel.send({ embed }).then(async (msg) => {
      const reactions = [
        "\u0031\u20E3",
        "\u0032\u20E3",
        "\u0033\u20E3",
        "\u0034\u20E3",
        "\u0035\u20E3",
      ];
      msg
        .awaitReactions(
          (reaction, user) =>
            reactions.includes(reaction.emoji.name) && user.id != msg.author.id,
          { max: 1, time: 20000 }
        )
        .then(async (collected) => {
          if (!collected.first()) return;
          const reaction = collected.first();
          url = urlArr[reactions.indexOf(reaction.emoji.name)];
          playStream(url.href, message);
        });

      for (let i = 0; i < urlArr.length; i++) {
        setTimeout(() => msg.react(reactions[i]), 10 * i);
        // await msg.react(reactions[i]);
      }
    });
  } else message.reply(`You must join a voice channel first!!`);
};

playStream = async (url, message) => {
  const guildId = message.channel.guild.id;
  const ytdl = require("ytdl-core");

  if (queue[guildId] && queue[guildId][0] && url !== "next") {
    const songDetails = await ytdl.getBasicInfo(url);
    queue[guildId][1] = { url, title: songDetails.title };
    message.reply(`Added \`\`${songDetails.title}\`\` to queue`);
    return;
  } else if (!queue[guildId]) {
    const songDetails = await ytdl.getBasicInfo(url);
    queue[guildId] = [{ url, title: songDetails.title }];
  }

  if (url === "next") url = queue[guildId][0].url;

  const songDetails = await ytdl.getBasicInfo(url);
  song = await message.channel.send(
    `Playing :musical_note: ${songDetails.title} :musical_note: 
Volume: \`\` 20% \`\`
Status: \`\` Playing \`\``
  );
  const reactions = [`⏯`, `🔈`, `🔊`, "⏩"];
  for (reaction of reactions) await song.react(reaction);
  // Member will always be in a voice channel at this point.
  message.member.voice.channel
    .join()
    .then(async (connection) => {
      dispatchers[guildId] = "";
      let stream = ytdl(url, {
        filter: "audioonly",
        quality: "highestaudio",
        liveChunkReadahead: 10,
        highWaterMark: 1 << 20,
      });
      dispatchers[guildId] = connection.play(stream);

      stream.on("error", console.log);
      // stream.on("data", console.log);
      // stream.on("progress", console.log);
      stream.on("end", () => console.log(`End of stream`));

      dispatchers[guildId].setVolume(0.2);
      dispatchers[guildId].on("finish", (end) => {
        song.content = song.content.split(`\`\``);
        song.content[3] = "Ended";
        song.content = song.content.join(`\`\``);
        song.edit(song.content);
        collector.stop();

        if (queue[guildId]) queue[guildId].shift();
        if (queue[guildId] && queue[guildId][0]) {
          playStream("next", message);
          return;
        }
        message.guild.me.voice.channel.leave();
      });
    })
    .catch(console.error);

  collector = song.createReactionCollector(
    // Filter for collecting reactions. Only reactions passing through filter collected
    (reaction, user) =>
      reactions.includes(reaction.emoji.name) && user.id != song.author.id,
    { time: 100000000 } // Long time
  );
  collector.on("collect", async (reaction, reactionCollector) => {
    const index = reactions.indexOf(reaction.emoji.name);
    if (index === 0) {
      // if (song.reactions.get(reactions[0]).count % 2 === 0)
      //   dispatcher.pause();
      // else dispatcher.play();
      song.content = song.content.split(`\`\``);
      if (dispatchers[guildId].paused) {
        await dispatchers[guildId].resume();
        song.content[3] = "Playing";
      } else {
        await dispatchers[guildId].pause();
        song.content[3] = "Paused";
      }
      song.content = song.content.join(`\`\``);
      song.edit(song.content);
    } else if (index === 1) {
      // Decrease Volume
      if (dispatchers[guildId].volume && dispatchers[guildId].volume > 0.1) {
        await dispatchers[guildId].setVolume(
          Math.round((dispatchers[guildId].volume - 0.1) * 10) / 10
        );
      } else await dispatchers[guildId].setVolume(0);
      song.content = song.content.split(`\`\``);
      song.content[1] = `${dispatchers[guildId].volume * 100}%`;
      song.content = song.content.join(`\`\``);
      song.edit(song.content);
    } else if (index === 2) {
      // Increase Volume
      if (dispatchers[guildId].volume && dispatchers[guildId].volume < 0.9) {
        await dispatchers[guildId].setVolume(
          Math.round((dispatchers[guildId].volume + 0.1) * 10) / 10
        );
      } else await dispatchers[guildId].setVolume(1);
      song.content = song.content.split(`\`\``);
      song.content[1] = `${dispatchers[guildId].volume * 100}%`;
      song.content = song.content.join(`\`\``);
      song.edit(song.content);
    } else if (index === 3) {
      skip(message);
    }
  });
  collector.on("end", (collected) => {
    return;
  });
};

// Streams a song directly from the server.
module.exports.playSong = (message) => {
  const guildId = message.channel.guild.id;
  const rootMusicDir = "D:Music";
  fs.readdir(rootMusicDir, async (err, tempFiles) => {
    if (err) console.error(err);
    const filesLower = [];
    tempFiles.map((file, i) => filesLower.push(file.toLowerCase()));

    const matching = [];
    message.content = message.content.substr(7).toLowerCase();
    for (file of filesLower)
      if (file.includes(message.content)) matching.push(file);

    if (matching.length === 1) {
      if (message.member.voice.channel) {
        song = await message.channel.send(
          `Playing :musical_note: ${matching[0]} :musical_note: 
Volume: \`\` 100% \`\`
Status: \`\` Playing \`\``
        );
        const reactions = [`⏯`, `🔈`, `🔊`];
        for (reaction of reactions) await song.react(reaction);
        collector = song.createReactionCollector(
          // Filter for collecting reactions. Only reactions passing through filter collected
          (reaction, user) =>
            reactions.includes(reaction.emoji.name) &&
            user.id != song.author.id,
          { time: 10000 }
        );
        collector.on("collect", async (reaction, reactionCollector) => {
          const index = reactions.indexOf(reaction.emoji.name);
          if (index === 0) {
            // if (song.reactions.get(reactions[0]).count % 2 === 0)
            //   dispatcher.pause();
            // else dispatcher.play();
            song.content = song.content.split(`\`\``);
            if (dispatchers[guildId].paused) {
              await dispatchers[guildId].resume();
              song.content[3] = "Playing";
            } else {
              await dispatchers[guildId].pause();
              song.content[3] = "Paused";
            }
            song.content = song.content.join(`\`\``);
            song.edit(song.content);
          } else if (index === 1) {
            // Decrease Volume
            if (
              dispatchers[guildId].volume &&
              dispatchers[guildId].volume > 0.1
            ) {
              await dispatchers[guildId].setVolume(
                Math.round((dispatchers[guildId].volume - 0.1) * 10) / 10
              );
            } else await dispatchers[guildId].setVolume(0);
            song.content = song.content.split(`\`\``);
            song.content[1] = `${dispatchers[guildId].volume * 100}%`;
            song.content = song.content.join(`\`\``);
            song.edit(song.content);
          } else if (index === 2) {
            // Increase Volume
            if (
              dispatchers[guildId].dispatchers[guildId] &&
              dispatcher.volume < 0.9
            ) {
              await dispatchers[guildId].setVolume(
                Math.round((dispatchers[guildId].volume + 0.1) * 10) / 10
              );
            } else await dispatchers[guildId].setVolume(1);
            song.content = song.content.split(`\`\``);
            song.content[1] = `${dispatchers[guildId].volume * 100}%`;
            song.content = song.content.join(`\`\``);
            song.edit(song.content);
          }
        });
        collector.on("end", (collected) => {
          return;
        });
        // song.awaitReactions(
        //   (filter = (reaction, user) =>
        //     reactions.includes(reaction.emoji.name) &&
        //     user.id != song.author.id),
        //   { time: 600000 } // Time = 10 Minutes
        // ).then(async collected)
        message.member.voice.channel
          .join()
          .then(async (connection) => {
            dispatchers[guildId] = await connection.playFile(
              `${rootMusicDir}${matching[0]}`
            );
            dispatchers[guildId].on("finish", (end) => {
              song.content = song.content.split(`\`\``);
              song.content[3] = "Ended";
              song.content = song.content.join(`\`\``);
              song.edit(song.content);
              message.guild.me.voice.channel.leave();
              collector.stop();
            });
          })
          .catch(console.log);
      } else message.channel.send("You must Join a Voice Channel First!");
    } else if (matching.length > 1) {
      const embed = new Discord.MessageEmbed()
        .setTitle("Songs Found:")
        .setColor(0xff00aa)
        .setDescription(
          "The list of Songs available on the server that match your query are:"
        );
      for (match of matching)
        embed.addField(match, "-----------------------------------");

      message.channel.send({ embed });
    } else {
      message.channel.send(
        `The server has no tracks that match your search query. Please try some other song.`
      );
    }
  });
};
