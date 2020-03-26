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
  html = await $(`div.yt-lockup-thumbnail`).each((i, elem) => {
    for (child of elem.children)
      if (child.name == "a") {
        urlArr.push(child.attribs.href);
        break;
      }
  });
  return urlArr;
};
