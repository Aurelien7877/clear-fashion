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

const products =[]


async function sandbox (eshop = 'https://www.montlimart.com/99-vetements' ) {

  console.log(`🕵️‍♀️  browsing ${eshop} eshop`);
  let i = 0;
  for (const urls of urlMontli) {
     products = await montlimartbrand.scrapeAndSave(urls , 'Montlimardproducts.json',i)
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


const {MongoClient} = require('mongodb');
const MONGODB_URI = 'mongodb+srv://admin:admin@clear-fashion.ykj5vxa.mongodb.net/test';
const MONGODB_DB_NAME = 'clear-fashion';

async function connectToDatabase() {
  const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
  const db = client.db(MONGODB_DB_NAME);
  const collection = db.collection('products');
  const result = await collection.insertMany(products);
  console.log("products : ",result);
}
connectToDatabase();


