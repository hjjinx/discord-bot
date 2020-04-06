const Axios = require("axios");
const cheerio = require("cheerio");

// import Axios from "axios";

module.exports = async query => {
  const res = await Axios.get(
    `https://www.google.com/search?q=lyrics+${query}`
  );
  let html = res.data;
  const htmlparser = require("htmlparser2");
  const dom = htmlparser.parseDOM(html);
  const $ = cheerio.load(dom);

  var lyrics = "";
  html = await $(`div.BNeawe.tAd8D.AP7Wnd`).each((i, elem) => {
    if (i == 3) lyrics = elem.children[0].data;
  });
  return lyrics;
};
