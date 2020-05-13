const Discord = require("discord.js");

module.exports.index = (message) => {
  if (message.content === "/help") {
    const embed = new Discord.MessageEmbed()
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
        "/p",
        `Stream a song directly from YouTube. Type \`\`/p songname\`\` to play a song.`
      )
      .addField(
        "/weather",
        `Get weather of any city. Type \`\`/weather cityname\`\``
      );
    message.channel.send({ embed });
    // Send General Help here
  } else if (message.content === "/help lyrics")
    message.channel
      .send(`I can provide you with the lyrics of any track in the world (almost any). 
To get the lyrics, Write \`\`/lyrics *song/artist name here**\`\`
If you want to search for Lyrics of the song Rockstar by Post Malone, type \`\`/lyrics rockstar post malone\`\`
Lyrics are directly fetched from the Google search results`);
  else if (message.content === "/help weather")
    message.channel.send(
      `I can send you the weather details of any place in the whole world. The data is fetched from the OpenWeatherMap API.
To fetch the weather of Chandigarh, type \`\`/weather chandigarh\`\``
    );
  else if (message.content === "/help p")
    message.channel.send(
      `I can stream any video from YouTube directly & I just need the URL for the video 😄, type \`\`/p *URL*\`\``
    );
};
