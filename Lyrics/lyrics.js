const Discord = require("discord.js");
const axios = require("axios");
const token = require("../secret.json").musixmatch_token;
const root = "https://api.musixmatch.com/ws/1.1";
const gLyrics = require("./googleLyricsApi");

module.exports.getLyrics = async message => {
  if (message.content.includes(`/lyrics`))
    message.content = message.content.substr(8);
  let arrTracks = [];
  let res = await axios.get(
    `${root}/track.search?apikey=${token}&q_track_artist=${message.content}&s_track_rating=desc&page_size=5`
  );
  const lyrics = await gLyrics(message.content);

  sendLyrics(message, lyrics);
  // const tracks = res.data.message.body.track_list;
  // tracks.forEach(track =>
  //   arrTracks.push({
  //     ID: `${track.track.commontrack_id}`,
  //     track: `${track.track.track_name}`,
  //     artist: `${track.track.artist_name}`
  //   })
  // );
  // if (arrTracks.length == 0) {
  //   message.channel.send(
  //     `No Lyrics found for the provided search query in the Musixmatch Database. Please be specific while searching and only write the name of the song and the artist.`
  //   );
  //   return;
  // }
  // const embed = new Discord.MessageEmbed()
  //   .setTitle("Lyrics Found:")
  //   .setColor(0xff00aa)
  //   .setDescription(
  //     "Which lyrics are you looking for? React with the #️⃣ of the track listed below within 10 seconds:"
  //   );
  // for (let i = 0; i < arrTracks.length; i++) {
  //   embed.addField(`${i + 1}. ${arrTracks[i].track}`, arrTracks[i].artist);
  // }

  // message.channel
  //   .send({ embed })
  //   .then(async msg => {
  //     const reactions = [
  //       "\u0031\u20E3",
  //       "\u0032\u20E3",
  //       "\u0033\u20E3",
  //       "\u0034\u20E3",
  //       "\u0035\u20E3"
  //     ];
  //     for (let i = 0; i < arrTracks.length; i++) await msg.react(reactions[i]);
  //     msg
  //       .awaitReactions(
  //         (filter = (reaction, user) =>
  //           reactions.includes(reaction.emoji.name) &&
  //           user.id != msg.author.id),
  //         { max: 1, time: 10000 }
  //       )
  //       .then(async collected => {
  //         if (!collected.first()) return;
  //         const reaction = collected.first();
  //         const track = arrTracks[reactions.indexOf(reaction.emoji.name)];
  //         const res = await axios.get(
  //           `${root}/track.lyrics.get?apikey=${token}&commontrack_id=${track.ID}`
  //         );
  //         delete arrTracks;
  //         if (res.data.message.header.status_code != 200) {
  //           message.channel.send(
  //             `Lyrics not Found. Error ${res.data.message.header.status_code}.`
  //           );
  //           return;
  //         }
  //         message.channel.send(
  //           `Upcoming Lyrics of ${track.track} by ${track.artist}`
  //         );
  //         let lyrics = res.data.message;
  //         lyrics = lyrics.body.lyrics.lyrics_body;
  //         lyrics = lyrics.split("**")[0];
  //         lyrics +=
  //           "Lyrics powered by www.musixmatch.com. This Lyrics is NOT for Commercial use and only 30% of the lyrics are returned.\n...\n\nBot created by hjjinx#1993. Contact hjjinx@gmail.com";
  //         // lyricsArr = [lyrics];
  //         sendLyrics(lyrics);
  //       })
  //       .catch(err => console.log(err));
  //   })
  //   .catch(err => console.log(err));
};

const sendLyrics = (message, lyrics) => {
  message.channel.send(`Lyrics upcoming:`);
  lyricsArr = [lyrics];

  // Since Discord limits messages to 2000 characters
  while (lyricsArr[lyricsArr.length - 1].length > 1800) {
    lyrics1 = lyricsArr[lyricsArr.length - 1];
    const position = lyrics1.indexOf("\n", 1800);
    lyrics1 = lyrics1.substr(0, position);
    const lyrics2 = lyricsArr[lyricsArr.length - 1].substr(position);
    lyricsArr[lyricsArr.length - 1] = lyrics1;
    lyricsArr.push(lyrics2);
  }
  lyricsArr.forEach(lyrics => message.channel.send(`\`\`\`${lyrics}\`\`\``));
};
