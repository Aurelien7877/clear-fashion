/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./eshops/dedicatedbrand');
const montlimartbrand = require('./eshops/montlimartbrand');
const circlesportswear = require('./eshops/CircleSportswear');
//montlimart = https://www.montlimart.com/99-vetements
//chaussures = https://www.montlimart.com/14-chaussures

//dedicated = https://www.dedicatedbrand.com/en/men/news
//dedicated = https://www.dedicatedbrand.com/en/loadfilter

//circlesportswear = https://shop.circlesportswear.com/collections/all
//const url = 'https://shop.circlesportswear.com/collections/all' //json de tou dedicated
const url = 'https://www.montlimart.com/99-vetements'
const urlMontli = ['https://www.montlimart.com/99-vetements','https://www.montlimart.com/14-chaussures','https://www.montlimart.com/15-accessoires']


async function sandbox (eshop = 'https://www.montlimart.com/99-vetements' ) {

  console.log(`🕵️‍♀️  browsing ${eshop} eshop`);
  let i = 0;
  for (const urls of urlMontli) {
    const products = await montlimartbrand.scrapeAndSave(urls , 'Montlimardproducts.json',i)
      .then((products) => {
        console.log(products);
        console.log('done');
      })
      .catch((error) => {
        console.error(error);
      });
    i++;
  }

  process.exit(0);
}
sandbox(urlMontli);