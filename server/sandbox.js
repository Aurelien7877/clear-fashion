/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./eshops/dedicatedbrand');
const montlimartbrand = require('./eshops/montlimartbrand');
const circlesportswear = require('./eshops/CircleSportswear');

const Urldedicated = 'https://www.dedicatedbrand.com/en/loadfilter'

const Urlcirclesportswear = 'https://shop.circlesportswear.com/collections/all';

const urlMontli = ['https://www.montlimart.com/99-vetements','https://www.montlimart.com/14-chaussures','https://www.montlimart.com/15-accessoires']
const all = ['https://www.dedicatedbrand.com/en/loadfilter','https://shop.circlesportswear.com/collections/all',
'https://www.montlimart.com/99-vetements','https://www.montlimart.com/14-chaussures','https://www.montlimart.com/15-accessoires']
const brands = ['Montlimart','Circle','Dedicated']
const CircleName = 'Circle';

async function sandbox (eshop) {

  console.log(`🕵️‍♀️  browsing ${eshop} eshop`);

	if (eshop == 'Montlimart'){
    let temp;
    let prod = [];
    let i = 0;
      for (const urls of urlMontli) {
        temp = await montlimartbrand.scrapeAndSave(urls , 'Montlimardproducts.json',i)
        prod=prod.concat(temp)
        i++;
	    }
      console.log(` There are ${prod.length} products in Montlimart `);
      return prod;
  }

	if (eshop == 'Circle'){
		console.log(`🕵️‍♀️  browsing ${eshop} eshop`);
		products = await circlesportswear.scrapeAndSave(Urlcirclesportswear , 'circleproduct.json')
    console.log(` There are ${products.length} products in Circle `);
		console.log('done');
		return products;
	}
  if (eshop == 'Dedicated'){
		console.log(`🕵️‍♀️  browsing ${eshop} eshop`);
		products = await dedicatedbrand.scrapeAndSave(Urldedicated , 'dedicatedproducts.json')
    console.log(` There are ${products.length} products in Dedicated `);
		console.log('done');
		return products;	
	}
	else {console.log('Not here !');}
}

const {MongoClient} = require('mongodb');


async function connectToDatabase(products) {
  const MONGODB_URI = 'mongodb+srv://admin:admin@clear-fashion.ykj5vxa.mongodb.net/?retryWrites=true&w=majority';
  const MONGODB_DB_NAME = 'clear-fashion';
  console.log("connection..");
  const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
  console.log("connected");
  const collectionName = 'products';

  const db = client.db(MONGODB_DB_NAME);
  const collection = db.collection(collectionName);
  if (!await collection.findOne()) {
    await db.createCollection(collectionName);
  }
  collection.drop();
  const result = await collection.insertMany(products);
  console.log("Done insertion");

  console.log("test : Circle products");
  const circleproduct = await collection.find({brandName : "Circle"}).toArray();;

  console.log(circleproduct);
  client.close();
}


async function ProductsToMongoDB() {
  let products =[];
  let temp;
  for (const brandName of brands) {
    temp = await sandbox(brandName);
	  products = products.concat(temp);

  }
	console.log('Done all brands, now connection...\n')
  await connectToDatabase(products);

  const Allprod = JSON.stringify(products);
	var fs = require('fs');
	fs.writeFile("Allproducts.json", Allprod, function(err) {
		if (err) {console.log(err);}
  })
}

ProductsToMongoDB();