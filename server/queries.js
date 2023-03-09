const {MongoClient} = require('mongodb');
const MONGODB_URI = 'mongodb+srv://admin:admin@clear-fashion.ykj5vxa.mongodb.net/?retryWrites=true&w=majority';
const MONGODB_DB_NAME = 'clear-fashion';
const brand = 'Circle';

//These 5 methods should

//Find all products related to a given brands
//Find all products less than a price
//Find all products sorted by price
//Find all products sorted by date
//Find all products scraped less than 2 weeks

async function BrandFilter(brand) {	
	const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
	const db =  client.db(MONGODB_DB_NAME);
	const collection = db.collection('products');
	const result = await collection.find({brandName:brand}).toArray();
    client.close();
	console.log(result);
}

async function PriceFilter(Price) {	

	const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
	const db =  client.db(MONGODB_DB_NAME);
	const collection = db.collection('products');
    const result = await collection.find({price: {$lt: Price}}).toArray();
    client.close();
	console.log(result);
}

async function PriceSorted() {	

	const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
	const db =  client.db(MONGODB_DB_NAME);
	const collection = db.collection('products');
    const result = await collection.find().sort({price: -1}).toArray();//descending
    client.close();
	console.log(result);
}

async function DateSorted() {	
    
	const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
	const db =  client.db(MONGODB_DB_NAME);
	const collection = db.collection('products');
    const result = await collection.find().sort({date: -1}).toArray(); //descending
    client.close();
	console.log(result);
}

async function Recent() {	

	const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
	const db =  client.db(MONGODB_DB_NAME);
	const collection = db.collection('products');
	const Twoweeks = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000); //2 semaines
    const result = await collection.find({date: {$gt: Twoweeks}}).toArray();
	client.close();
    console.log(result);
}

PriceSorted();