var search = async function (query, attemptNum = 1) {
  const axios = require("axios");
  const cheerio = require("cheerio");
  const res = await axios.get(
    `https://www.youtube.com/results?search_query=${encodeURIComponent(
      query
    )}&sp=EgIQAQ%253D%253D`
  );
  let html = res.data;
  const htmlparser = require("htmlparser2");
  const hh = htmlparser.parseDOM(html);
  const $ = cheerio.load(hh);

  var urlArr = [];
  html = await $(`h3.yt-lockup-title`).each((i, elem) => {
    const child = elem.children[0];
    urlArr.push({
      href: `https://youtube.com${child.attribs.href}`,
      title: child.attribs.title,
    });

    if (i == 4) return false;
  });

  // YouTube changed the way that they returned their HTML. Will fix later.
  // const jsdom = require("jsdom");
  // const { JSDOM } = jsdom;
  // const document = new JSDOM(html, {
  //   runScripts: "dangerously",
  //   resources: "usable",
  // });
  // // console.log(document.serialize());

  // JSDOM.fromURL(
  //   `https://www.youtube.com/results?search_query=${encodeURIComponent(
  //     query
  //   )}&sp=EgIQAQ%253D%253D`,
  //   {
  //     runScripts: "dangerously",
  //     resources: "usable",
  //   }
  // ).then((dom) => {
  //   console.log(dom.serialize());
  // });

  // Temporary fix until then..
  // Will keep sending request to YouTube for search results,
  // until YouTube sends the results in the older method
  // Or, until we reach 100 tries
  while (urlArr.length === 0 || attemptNum < 100) {
    urlArr = search(query, ++attemptNum);
  }

  return urlArr;
};

module.exports.search = search;
