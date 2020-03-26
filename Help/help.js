const Discord = require("discord.js");

module.exports.index = message => {
  if (message.content === "/help") {
    const embed = new Discord.RichEmbed()
      .setTitle("Help Options:")
      .setColor(0xff00aa)
      .setDescription(
        `To expand upon these commands further, type \`\`/help *command name*\`\``
      )
      .addField(
        "/lyrics",
        `Get lyrics of any song. Type \`\`/lyrics songname\`\` for lyrics`
      )
      .addField(
        "/music",
        `Stream a song directly from the server (The collection is only limited to the songs available on the server). Type \`\`/music songname\`\` to play a song.`
      )
      .addField(
        "/weather",
        `Get weather of any city. Type \`\`/weather cityname\`\``
      )
      .addField(
        "/stream",
        `Stream any video from YouTube directly. Type \`\`/stream <url for video>\`\``
      );
    message.channel.send({ embed });
    // Send General Help here
  } else if (message.content === "/help lyrics")
    message.channel
      .send(`I can provide you with the lyrics of any track in the world (almost any). 
To get the lyrics, Write **/lyrics *song/artist name here***
If you want to search for Lyrics of the song Rockstar by Post Malone, type \`\`/lyrics rockstar post malone\`\`
Lyrics are directly fetched from MusixMatch API. I am using the free version which limits the lyrics provided to only 30%.`);
  else if (message.content === "/help music")
    message.channel.send(
      `I can play any song directly that is present on the server on which I am running. I can also stream music from the web, but that will be slower than direct stream. If you want to play a specific song using this command which is not available on the server, you can request my master **hjjinx@gmail.com** for adding specific songs to the server.
For playing a song, type \`\`/music songname\`\``
    );
  else if (message.content === "/help weather")
    message.channel.send(
      `I can send you the weather details of any place in the whole world. The data is fetched from the OpenWeatherMap API.
To fetch the weather of Chandigarh, type \`\`/weather chandigarh\`\``
    );
  else if (message.content === "/help stream")
    message.channel.send(
      `I can stream any video from YouTube directly, & I just need the URL for the video 😄, type \`\`/stream <URL for video>\`\``
    );
};
