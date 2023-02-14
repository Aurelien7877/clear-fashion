/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./eshops/dedicatedbrand');
const montlimartbrand = require('./eshops/montlimartbrand');
//montlimart = https://www.montlimart.com/99-vetements
//dedicated = https://www.dedicatedbrand.com/en/men/news

async function sandbox (eshop = 'https://www.montlimart.com/99-vetements') {

    console.log(`🕵️‍♀️  browsing ${eshop} eshop`);

    const products = await montlimartbrand.scrapeAndSave('https://www.montlimart.com/99-vetements', 'Montlimardproducts.json')
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
