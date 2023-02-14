/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./eshops/dedicatedbrand');
const montlimartbrand = require('./eshops/montlimartbrand');
const circlesportswear = require('./eshops/CircleSportswear');
//montlimart = https://www.montlimart.com/99-vetements
//dedicated = https://www.dedicatedbrand.com/en/men/news
//circlesportswear = https://shop.circlesportswear.com/collections/t-shirts-homme
const url = 'https://shop.circlesportswear.com/collections/t-shirts-homme'
async function sandbox (eshop = url) {

    console.log(`🕵️‍♀️  browsing ${eshop} eshop`);

    const products = await circlesportswear.scrapeAndSave(url, 'circleproduct.json')
    .then((products) => {
      console.log(products);
      console.log('done');
      process.exit(0);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });

}

const [,, eshop] = process.argv;

sandbox(eshop);
