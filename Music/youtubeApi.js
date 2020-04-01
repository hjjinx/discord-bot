module.exports.search = async function(query) {
  const axios = require("axios");
  const cheerio = require("cheerio");
  const res = await axios.get(
    `https://www.youtube.com/results?search_query=${query}`
  );
  let html = res.data;
  const htmlparser = require("htmlparser2");
  const dom = htmlparser.parseDOM(html);
  const $ = cheerio.load(dom);
  // console.log(html);
  // $(`div`).each((i, elem) => {
  //   console.log(elem);
  // });
  var urlArr = [];
  html = await $(`h3.yt-lockup-title`).each((i, elem) => {
    const child = elem.children[0];
    urlArr.push({ href: child.attribs.href, title: child.attribs.title });

    if (i == 4) return false;
  });
  return urlArr;
};
