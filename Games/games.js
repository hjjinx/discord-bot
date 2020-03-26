module.exports.gameHandler = message => {
  if (message.content == "/game guess") this.guess(message);
  else if (message.content == "/game quiz") this.quiz(message);
};

module.exports.guess = message => {
  message.channel.send(`Guess a number between 1-5`);
  const int = Math.floor(Math.random() * 5) + 1;
  const collector = message.channel.createMessageCollector(
    m => m.author.id == message.author.id,
    {
      max: 1,
      time: 10000
    }
  );
  collector.on("collect", m => {
    if (m.content == int)
      message.channel.send("Congratulations, you guessed right!");
    else message.channel.send(`Sorry, the correct number was ${int}`);
  });
};

module.exports.quiz = message => {
  const quizQuestions = require("./quizQuestions.json");
  console.log(quizQuestions);
  message.channel.send(
    `Get Ready!!! Question coming up. The first one to reply becomes Crorepati`
  );
  const rand = Math.floor(Math.random() * quizQuestions.length);
  console.log(rand);
  message.channel.send(quizQuestions[rand].question);
};
