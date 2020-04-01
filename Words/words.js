const axios = require("axios");
const wordsKey = require("../secret.json").words_token;
const Discord = require("discord.js");

module.exports.word = async message => {
  message.content = message.content.substr(6);
  message.content = message.content.trim();
  message.content = message.content.split(" ");
  let wordNum;
  if (
    message.content.length > 1 &&
    !isNaN(message.content[message.content.length - 1])
  )
    wordNum = message.content.pop();
  message.content = message.content.join(" ");
  try {
    var res = await axios.get(
      `https://wordsapiv1.p.mashape.com/words/${message.content}`,
      {
        headers: { "X-Mashape-Key": wordsKey }
      }
    );
  } catch (error) {
    if (error.response.status != 200) {
      if (error.response.status == 404)
        message.reply(
          `Word was not found in the WordsAPI Database. Please try some other word.`
        );
      return;
    }
  }
  const embed = new Discord.MessageEmbed()
    .setTitle(`Data is fetched from WordsAPI:`)
    .setColor(0xff00aa)
    .setDescription(
      `Total ${res.data.results.length} results found for the word ${
        message.content
      }. Use \`\`/word *word* *i*\`\` to get the i'th result`
    )
    .setURL(`https://www.wordsapi.com/`);
  res =
    res.data.results[wordNum - 1] || // Will happen if there are at least wordNum number of results
    res.data.results[res.data.results.length - 1] || // Will happen if res.data.results is an array, then we select the last result
    res.data.results; // Will happen if only 1 result

  if (res.definition) embed.addField(`Definition`, res.definition);
  if (res.synonyms) embed.addField(`Synonyms`, res.synonyms.join(", "));
  if (res.antonyms) embed.addField(`Antonyms`, res.antonyms.join(", "));
  if (res.rhymes) embed.addField(`Rhymes`, res.rhymes.all.join(", "));
  if (res.partOfSpeech) embed.addField(`Part of Speech`, res.partOfSpeech);
  if (res.examples)
    embed.addField(
      `Examples`,
      `${res.examples.join(`
`)}`
    );
  message.channel.send({ embed });
  //   console.log(res.data.results[0].synonyms);
};
