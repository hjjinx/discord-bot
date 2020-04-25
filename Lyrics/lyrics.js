const gLyrics = require("./googleLyricsApi");

module.exports.getLyrics = async (message) => {
  if (message.content.includes(`/lyrics`))
    message.content = message.content.substr(8);
  const lyrics = await gLyrics(message.content);

  sendLyrics(message, lyrics);
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
  lyricsArr.forEach((lyrics) => message.channel.send(`\`\`\`${lyrics}\`\`\``));
};
