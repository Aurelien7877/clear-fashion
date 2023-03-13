const cors = require('cors');
const express = require('express');
const helmet = require('helmet');

const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': true});
});

const {MongoClient} = require('mongodb');
 

//Endpoint 2 : Search for specific products
//OK, example : http://localhost:8092/products/search?limit=10&brandName=Circle&price=60

app.get('/products/search', async (request, response) => {
  const MONGODB_URI = 'mongodb+srv://admin:admin@clear-fashion.ykj5vxa.mongodb.net/?retryWrites=true&w=majority';
	const MONGODB_DB_NAME = 'clear-fashion';
  try{
	  const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
	  const db =  client.db(MONGODB_DB_NAME);
	  const collection = db.collection('products');


    const limitSearch = request.query.limit || 12;
    const brandSearch = request.query.brandName || undefined;
    const priceSearch = request.query.price || undefined;

    let query = {};
    if (brandSearch !== undefined) {
      query.brandName = brandSearch;
    }
    if (priceSearch !== undefined) {
      query.price = { $lte: parseInt(priceSearch) };
    }

    let endpointResult2 = await collection
    .find(query)
    .limit(parseInt(limitSearch))
    .sort({ price: 1 })
    .toArray();

	  response.send({result : endpointResult2});
  } catch(e){response.send({error : "search not valid !"});  }
});



//Endpoint 1 : Fetch a specific product

//Ok, exemple http://localhost:8092/products/640df194906481cb43eb2725 

//Obligé pour retouver l'id dans mongoDb Atlas
let ObjectId = require('mongodb').ObjectId;

app.get('/products/:id', async (request, response) => {
  const MONGODB_URI = 'mongodb+srv://admin:admin@clear-fashion.ykj5vxa.mongodb.net/?retryWrites=true&w=majority';
	const MONGODB_DB_NAME = 'clear-fashion';
  try{
	  const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
	  const db =  client.db(MONGODB_DB_NAME);
	  const collection = db.collection('products');
	  const findProduct = request.params.id;
	  let endpointResult1 = await collection.findOne({_id: ObjectId(findProduct)});
	  response.send({result : endpointResult1});
  } catch(e){response.send({error : "id not valid !"});  }
});



app.listen(PORT);
module.exports = app;
console.log(`📡 Running on port ${PORT}`);