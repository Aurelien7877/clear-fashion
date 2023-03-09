const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');

const baseUrl = 'https://www.montlimart.com';



/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);
  const brandName = 'Montlimart';
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
      let date = new Date().toISOString().slice(0, 10);
      return {name, color,price,link,img,date,brandName};
    })
    .get();
};

module.exports.scrapeAndSave = async (url, filename,i) => {
    try {
      const response = await fetch(url);
  
      if (response.ok) {
        const body = await response.text();
  
        const products = parse(body);
        if (i ==0) {
          //Truncate the file before appending else we have doublons
          fs.truncateSync(filename, 0);
        }
        // Append the new products to the file
        fs.appendFileSync(filename, JSON.stringify(products, null, 2));

      return products;
    }
  
      console.error(response);
  
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
