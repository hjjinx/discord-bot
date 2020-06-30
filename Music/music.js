const Discord = require("discord.js");
var dispatcher; // Voice Dispatcher of the song currently playing
var collector; // Reaction collector to the song playing

var queue = {};
var skipMessageDeleteTimeout = {};
var guildStorage = {
  // Structure of this storage:
  // guildId: {
  //   dispatcher: 1,
  //   volume: 1,
  //   message: "asd",
  // },
};

module.exports.pauseSong = async (message) => {
  const guildId = message.channel.guild.id;
  song = guildStorage[guildId].message;
  if (song) {
    song.content = song.content.split(`\`\``);
    if (!guildStorage[guildId].dispatcher.paused) {
      await guildStorage[guildId].dispatcher.pause();
      song.content[3] = "Paused";
    }
    song.content = song.content.join(`\`\``);
    song.edit(song.content);
    message.delete();
  }
};

module.exports.resumeSong = async (message) => {
  const guildId = message.channel.guild.id;
  song = guildStorage[guildId].message;
  if (song) {
    song.content = song.content.split(`\`\``);
    if (guildStorage[guildId].dispatcher.paused) {
      await guildStorage[guildId].dispatcher.resume();
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
  song = guildStorage[guildId].message;
  guildStorage[guildId].dispatcher.setVolume(content / 100);
  guildStorage[guildId].volume = parseFloat(content);
  if (song.content) {
    song.content = song.content.split(`\`\``);
    song.content[1] = `${guildStorage[guildId].dispatcher.volume * 100}%`;
    song.content = song.content.join(`\`\``);
    song.edit(song.content);
  }
  message.delete();
};

module.exports.leaveChannel = (message) => {
  const guildId = message.channel.guild.id;
  if (message.guild.me.voice.channel && guildStorage[guildId].dispatcher) {
    guildStorage[guildId].dispatcher.end();
    message.guild.me.voice.channel.leave();
    stop();
  }
};

module.exports.mute = (message) => {
  const guildId = message.channel.guild.id;
  song = guildStorage[guildId].message;
  if (song && guildStorage[guildId].dispatcher) {
    guildStorage[guildId].dispatcher.setVolume(0);
    song.content = song.content.split(`\`\``);
    song.content[3] = "Muted";
  }
  song.content = song.content.join(`\`\``);
  song.edit(song.content);
  message.delete();
};

module.exports.streamAfterHours = (message) => {
  // if (!message.member.voice.channel) {
  //   message.reply()
  //   return;
  // }
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

module.exports.streamStarboy = (message) => {
  queue[message.channel.guild.id] = [
    { url: "https://www.youtube.com/watch?v=3_g2un5M350", title: "Starboy" },
    {
      url: "https://www.youtube.com/watch?v=17c7kDMG_mU",
      title: "Party Monster",
    },
    {
      url: "https://www.youtube.com/watch?v=jBhbgZYz7pI",
      title: "False Alarm",
    },
    { url: "https://www.youtube.com/watch?v=a40tAP5MC6M", title: "Reminder" },
    { url: "https://www.youtube.com/watch?v=BCvmAySCnLk", title: "Rockin'" },
    { url: "https://www.youtube.com/watch?v=2QcSvOSXTBc", title: "Secrets" },
    {
      url: "https://www.youtube.com/watch?v=042WtX-131s",
      title: "True colors",
    },
    {
      url: "https://www.youtube.com/watch?v=Ir1tMjvMAWI",
      title: "Stargirl interlude",
    },
    { url: "https://www.youtube.com/watch?v=DWi73D1vZTc", title: "Sidewalks" },
    {
      url: "https://www.youtube.com/watch?v=Jt5nPuMgKA8",
      title: "Six Feet Under",
    },
    {
      url: "https://www.youtube.com/watch?v=a1PkVEHV-w8",
      title: "Love To Lay",
    },
    {
      url: "https://www.youtube.com/watch?v=atGlHRi0n4A",
      title: "A Lonely Night",
    },
    { url: "https://www.youtube.com/watch?v=RPCqZssID78", title: "Attention" },
    {
      url: "https://www.youtube.com/watch?v=tX2ncrjdZ3o",
      title: "Ordinary Life",
    },
    {
      url: "https://www.youtube.com/watch?v=LzEQYzKsxv0",
      title: "Nothing Without You",
    },
    { url: "https://www.youtube.com/watch?v=sfvFAqzIGh8", title: "All I Know" },
    {
      url: "https://www.youtube.com/watch?v=QLCpqdqeoII",
      title: "Die For You",
    },
    {
      url: "https://www.youtube.com/watch?v=qPRNIHxLhmc",
      title: "I Feel It Coming",
    },
  ];
  playStream("next", message);
};

const skip = async (message) => {
  const guildId = message.channel.guild.id;
  song = guildStorage[guildId].message;
  if (queue[guildId] && queue[guildId][0]) {
    queue[guildId].shift();
    if (message.guild.me.voice.channel) {
      if (song.content && guildStorage[guildId].dispatcher) {
        song.content = song.content.split(`\`\``);
        song.content[3] = "Skipped";
      }
      song.content = song.content.join(`\`\``);
      await song.edit(song.content);
      guildStorage[guildId].collector.stop();
    }
    playStream("next", message);
  }
};

module.exports.skip = skip;

const stop = (message) => {
  const guildId = message.channel.guild.id;
  song = guildStorage[guildId].message;
  delete queue[guildId];
  if (message.guild.me.voice.channel) {
    guildStorage[guildId].dispatcher.end();
    song.content = song.content.split(`\`\``);
    song.content[3] = "Stopped";
    song.content = song.content.join(`\`\``);
    song.edit(song.content);
    guildStorage[guildId].collector.stop();
    message.delete();
  }
};
module.exports.stopSong = stop;

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
  if (!message.member.voice.channel) {
    message.reply(`You must join a voice channel first!!`);
    return;
  }
  let url = message.content.split(" ");
  url = url.slice(1).join(" ");
  const ytdl = require("ytdl-core");
  if (url.startsWith("http")) {
    await playStream(url, message);
    return;
  }
  // If not a url, then search for the song on YouTube using youtubeApi.js
  const yt = require("./youtubeApi");
  message.channel.send(
    "Please paste the full link of the song. The search feature is under development. Apologies for any inconvenience caused! 🥺"
  );
  // let urlArr = await yt.search(url);
  // const embed = new Discord.MessageEmbed()
  //   .setColor(0xfd0016)
  //   .setTitle("Search Results Found: ");
  // for (let i = 0; i < urlArr.length; i++) {
  //   embed.addField(`${i + 1}: ${urlArr[i].title}`, urlArr[i].href);
  // }
  // message.channel.send({ embed }).then(async (msg) => {
  //   const reactions = [
  //     "\u0031\u20E3",
  //     "\u0032\u20E3",
  //     "\u0033\u20E3",
  //     "\u0034\u20E3",
  //     "\u0035\u20E3",
  //   ];
  //   msg
  //     .awaitReactions(
  //       (reaction, user) =>
  //         reactions.includes(reaction.emoji.name) && user.id != msg.author.id,
  //       { max: 1, time: 20000 }
  //     )
  //     .then(async (collected) => {
  //       if (!collected.first()) return;
  //       const reaction = collected.first();
  //       url = urlArr[reactions.indexOf(reaction.emoji.name)];
  //       playStream(url.href, message);
  //     });

  //   for (let i = 0; i < urlArr.length; i++) await msg.react(reactions[i]);
  // });
};

playStream = async (url, message) => {
  const guildId = message.channel.guild.id;
  const ytdl = require("ytdl-core");
  if (queue[guildId]) {
    if (queue[guildId][0] && url !== "next") {
      const songDetails = await ytdl.getBasicInfo(url);
      queue[guildId].push({ url, title: songDetails.title });
      message.reply(`Added \`\`${songDetails.title}\`\` to queue`);
      return;
    } else if (queue[guildId][0] && url === "next") {
      url = queue[guildId][0].url;
      const songDetails = await ytdl.getBasicInfo(url);
      queue[guildId][0] = { url, title: songDetails.title };
    } else {
      const songDetails = await ytdl.getBasicInfo(url);
      queue[guildId][0] = { url, title: songDetails.title };
    }
  } else {
    const songDetails = await ytdl.getBasicInfo(url);
    queue[guildId] = [{ url, title: songDetails.title }];
  }

  const songDetails = await ytdl.getBasicInfo(url);
  song = await message.channel.send(
    `Playing :musical_note: ${songDetails.title} :musical_note: 
Volume: \`\` ${
      guildStorage[guildId] ? guildStorage[guildId].volume * 100 : 20
    }% \`\`
Status: \`\` Playing \`\``
  );
  if (!guildStorage[guildId])
    guildStorage[guildId] = { volume: 0.2, message: song };
  else guildStorage[guildId].message = song;
  const reactions = [`⏹️`, `⏯`, "⏭", `🔄`, `🔈`, `🔊`];
  message.member.voice.channel
    .join()
    .then(async (connection) => {
      if (!guildStorage[guildId]) guildStorage[guildId] = { volume: 0.2 };

      let info = await ytdl.getInfo(url, {
        filter: "audioonly",
        quality: "highestaudio",
        // liveChunkReadahead: 20,
        highWaterMark: 1 << 20,
      });
      console.log(info);
      let stream = ytdl(url, {
        filter: "audioonly",
        quality: "highestaudio",
        // liveChunkReadahead: 20,
      });
      guildStorage[guildId].dispatcher = connection.play(stream, {
        volume: guildStorage[guildId].volume || 0.2,
      });
      for (reaction of reactions) await song.react(reaction);

      stream.on("error", (err) => {
        console.log(err);

        const guildId = message.channel.guild.id;
        song = guildStorage[guildId].message;
        delete queue[guildId];
        if (message.guild.me.voice.channel) {
          guildStorage[guildId].dispatcher.end();
          song.content = song.content.split(`\`\``);
          song.content[3] = "Errored :(";
          song.content = song.content.join(`\`\``);
          song.edit(song.content);
          guildStorage[guildId].collector.stop();
        }

        message.channel.send("Apologies! There was an error 🥺");
      });
      // stream.on("data", console.log);
      // stream.on("progress", console.log);
      stream.on("end", () =>
        console.log(`YTDL has completely downloaded the song.`)
      );

      guildStorage[guildId].dispatcher.on("finish", (end) => {
        song = guildStorage[guildId].message;

        song.content = song.content.split(`\`\``);
        song.content[3] = "Ended";
        song.content = song.content.join(`\`\``);
        song.edit(song.content);
        guildStorage[guildId].collector.stop();

        if (queue[guildId]) queue[guildId].shift();
        if (queue[guildId] && queue[guildId][0]) {
          playStream("next", message);
          return;
        }
        message.guild.me.voice.channel.leave();
      });
      guildStorage[guildId].dispatcher.on("error", (err) =>
        console.error("error in discord dispatcher: " + err)
      );
      guildStorage[guildId].dispatcher.on("warn", (err) =>
        console.log("warn in discord dispatcher" + err)
      );
    })
    .catch((err) => {
      console.error(err);
      message.guild.me.voice.channel.leave();
      message.channel.send(
        "Apologies! There was an error. Could you please write that command again? 🥺"
      );
    });

  collector = song.createReactionCollector(
    // Filter for collecting reactions. Only reactions passing through filter collected
    (reaction, user) =>
      reactions.includes(reaction.emoji.name) && user.id != song.author.id,
    { time: 100000000 } // Long time
  );
  guildStorage[guildId].collector = collector;
  collector.on("collect", async (reaction, reactionCollector) => {
    const index = reactions.indexOf(reaction.emoji.name);
    song = guildStorage[guildId].message;
    if (index === 0) {
      const guildId = message.channel.guild.id;
      song = guildStorage[guildId].message;
      delete queue[guildId];
      if (message.guild.me.voice.channel) {
        guildStorage[guildId].dispatcher.end();
        song.content = song.content.split(`\`\``);
        song.content[3] = "Stopped";
        song.content = song.content.join(`\`\``);
        song.edit(song.content);
        guildStorage[guildId].collector.stop();
      }
    } else if (index === 1) {
      song.content = song.content.split(`\`\``);
      if (guildStorage[guildId].dispatcher.paused) {
        await guildStorage[guildId].dispatcher.resume();
        song.content[3] = "Playing";
      } else {
        await guildStorage[guildId].dispatcher.pause();
        song.content[3] = "Paused";
      }
      song.content = song.content.join(`\`\``);
      song.edit(song.content);
    } else if (index === 2) {
      if (queue[guildId].length === 1) {
        if (!skipMessageDeleteTimeout[guildId]) {
          message.channel
            .send("This are no more songs in the queue!")
            .then((skipped) => {
              skipMessageDeleteTimeout[guildId] = setTimeout(() => {
                skipped.delete();
                delete skipMessageDeleteTimeout[guildId];
              }, 10000);
            });
        }
      } else skip(message);
    } else if (index === 3) {
      queue[guildId].splice(1, 0, queue[guildId][0]);
      skip(message);
    } else if (index === 4) {
      // Decrease Volume
      if (
        guildStorage[guildId].dispatcher.volume &&
        guildStorage[guildId].dispatcher.volume > 0.1
      )
        await guildStorage[guildId].dispatcher.setVolume(
          Math.round((guildStorage[guildId].dispatcher.volume - 0.1) * 10) / 10
        );
      else await guildStorage[guildId].dispatcher.setVolume(0);

      guildStorage[guildId].volume = guildStorage[guildId].dispatcher.volume;
      song.content = song.content.split(`\`\``);
      song.content[1] = `${guildStorage[guildId].dispatcher.volume * 100}%`;
      song.content = song.content.join(`\`\``);
      song.edit(song.content);
    } else if (index === 5) {
      // Increase Volume
      if (
        guildStorage[guildId].dispatcher.volume &&
        guildStorage[guildId].dispatcher.volume < 0.8
      )
        await guildStorage[guildId].dispatcher.setVolume(
          Math.round((guildStorage[guildId].dispatcher.volume + 0.2) * 10) / 10
        );
      else await guildStorage[guildId].dispatcher.setVolume(1);
      guildStorage[guildId].volume = guildStorage[guildId].dispatcher.volume;
      song.content = song.content.split(`\`\``);
      song.content[1] = `${guildStorage[guildId].dispatcher.volume * 100}%`;
      song.content = song.content.join(`\`\``);
      song.edit(song.content);
    }
  });
  collector.on("end", (collected) => {
    return;
  });
};
