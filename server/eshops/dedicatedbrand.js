const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);

  return $('.productList-container .productList')
    .map((i, element) => {
      const name = $(element)
        .find('.productList-title')
        .text()
        .trim()
        .replace(/\s/g, ' ');
      const price = parseInt(
        $(element)
          .find('.productList-price')
          .text()
      );
      const link ='https://www.dedicatedbrand.com'+ $(element)
        .find('.productList-link').attr('href');

      const image =$(element)
        .find('.js-lazy')
        .attr('data-src')
      let date = new Date().toISOString().slice(0, 10);
      return {name, price,link,image,date};
    })
    .get();
};

module.exports.scrapeAndSave = async (url, filename) => {
  try {
    const response = await fetch(url);

    if (response.ok) {
      const body = await response.text();

      const products = parse(body);
      fs.writeFileSync(filename, JSON.stringify(products, null, 2));

      return products;
    }

    console.error(response);

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};