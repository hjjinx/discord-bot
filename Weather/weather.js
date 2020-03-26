const root = `https://api.openweathermap.org/data/2.5/`;
const axios = require("axios");
const weatherKey = require("../secret.json").openWeather_token;
const Discord = require("discord.js");

module.exports.getWeather = async message => {
  message.content = message.content.substr(9);
  try {
    var res = await axios.get(
      `${root}weather?q=${message.content}&appid=${weatherKey}`
    );
  } catch (error) {
    console.log(error);
  }
  res = res.data;
  if (res.cod == "404") {
    if (res.message == "city not found")
      message.reply(
        `The city was not found. Please be as specific as possible`
      );
    else message.reply(`Error 404. Please try again with a different city`);
    return;
  }
  const embed = new Discord.RichEmbed()
    .setColor(0xff00aa)
    .setTitle(`Temperature report in ${res.name}, ${res.sys.country}`)
    .setURL(`https://openweathermap.org/city/${res.id}`)
    .setDescription(`Data fetched from OpenWeatherMap`)
    .addField(
      `Current Temperature is ${Math.round((res.main.temp - 273.15) * 100) /
        100} degrees celcius`,
      "-----------------------------------"
    )
    .addField(
      `Current weather is ${res.weather[0].description} ${
        res.clouds ? "and the sky is " + res.clouds.all + "% cloudy" : ""
      }`,
      "-----------------------------------"
    );
  message.channel.send(embed);
};
