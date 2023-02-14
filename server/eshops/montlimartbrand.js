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

  return $('.products-list.row .products-list__block')
    .map((i, element) => {
      const name = $(element)
        .find('.product-miniature__title')
        .text()
        .trim()
        .replace(/\s/g, ' ');
      const color = $(element)
        .find('.product-miniature__color')
        .text()
        .trim()
        .replace(/\s/g, ' ');
      const price = parseInt(
        $(element)
          .find('.product-miniature__pricing')
          .text()
      );
      const link = $(element)
        .find('.product-miniature__thumb-link')
        .attr('href');
      const img = $(element)
        .find('.w-100')
        .attr('data-src');

      return {name, color,price,link,img};
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