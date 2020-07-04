var search = async function (query) {
  const axios = require("axios");
  const cheerio = require("cheerio");
  const res = await axios.get(
    `https://www.youtube.com/results?search_query=${encodeURIComponent(
      query
    )}&sp=EgIQAQ%253D%253D`
  );
  let html = res.data;
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
    html = $.html();
    const startIndex = html.indexOf(`window["ytInitialData"]`) + 26;
    const endIndex = html.indexOf(`window["ytInitialPlayerResponse"]`) - 6;
    const length = endIndex - startIndex;
    const content = JSON.parse(html.substr(startIndex, length));
    const results =
      content.contents.twoColumnSearchResultsRenderer.primaryContents
        .sectionListRenderer.contents[0].itemSectionRenderer.contents;

    let firstIndexIsNotResults =
      results[0].showingResultsForRenderer || results[0].searchPyvRenderer;
    for (
      let i = firstIndexIsNotResults ? 1 : 0;
      i < (firstIndexIsNotResults ? 6 : 5);
      i++
    ) {
      urlArr.push({
        href: "https://youtube.com/watch?v=" + results[i].videoRenderer.videoId,
        title: results[i].videoRenderer.title.runs[0].text,
      });
    }

    // // videoId
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
