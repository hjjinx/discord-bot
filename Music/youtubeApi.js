var search = async function (query) {
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
  const $ = cheerio.load(html, { xmlMode: true });

  var urlArr = [];
  html = await $(`h3.yt-lockup-title`).each((i, elem) => {
    const child = elem.children[0];
    urlArr.push({
      href: `https://youtube.com${child.attribs.href}`,
      title: child.attribs.title,
    });

    if (i == 4) return false;
  });

  if (urlArr.length === 0) {
    let script = await $("script").get()[26].children[0].data;

    var badJson = script.substr(30, script.length - 140);

    const json5 = require("json5");

    var correctJson = badJson.replace(/\n/g, "");
    correctJson = json5.parse(correctJson);

    let results =
      correctJson.contents.twoColumnSearchResultsRenderer.primaryContents
        .sectionListRenderer.contents[0].itemSectionRenderer.contents;

    // videoId
    for (let i = 0; i < 5; i++) {
      urlArr.push({
        href: "https://youtube.com/watch?v=" + results[i].videoRenderer.videoId,
        title: results[i].videoRenderer.title.runs[0].text,
      });
    }
    // console.log(
    //   "https://youtube.com/watch?v=" + results[0].videoRenderer.videoId
    // );

    // // thumbnail
    // console.log(
    //   results[0].videoRenderer.thumbnail.thumbnails[
    //     results[0].videoRenderer.thumbnail.thumbnails.length - 1
    //   ].url
    // );

    // // Title
    // console.log(results[0].videoRenderer.title.runs[0].text);

    // // Channel name
    // console.log(results[0].videoRenderer.longBylineText.runs[0].text);
  }

  return urlArr;
};

module.exports.search = search;
