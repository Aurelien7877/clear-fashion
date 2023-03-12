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
let ObjectId = require('mongodb').ObjectId; //Obligé pour retouver l'id dans mongoDb Atlas

//Endpoint 1 : Fetch a specific product

//Ok, exemple http://localhost:8092/products/640a251e422a62b7b213e39b

/*app.get('/products/:id', async (request, response) => {
  const MONGODB_URI = 'mongodb+srv://admin:admin@clear-fashion.ykj5vxa.mongodb.net/?retryWrites=true&w=majority';
	const MONGODB_DB_NAME = 'clear-fashion';
  try{
	  const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
	  const db =  client.db(MONGODB_DB_NAME);
	  const collection = db.collection('products');
	  const findProduct = request.params.id;
	  let endpointResult = await collection.findOne({_id: ObjectId(findProduct)});
	  response.send({result : endpointResult});
  } catch(e){response.send({error : "id not valid !"});  }
});*/


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
    const brandSearch = request.query.brandName || 'All Brand';
    const priceSearch = request.query.price || 'All price';

    let query = {};
    if (brandSearch !== 'All brands') {
      query.brandName = brandSearch;
    }
    if (priceSearch !== 'All price') {
      query.price = { $lte: parseInt(priceSearch) };
    }

    let endpointResult = await collection.find(query).limit(parseInt(limitSearch)).toArray();

	  response.send({result : endpointResult});
  } catch(e){response.send({error : "search not valid !"});  }
});

app.listen(PORT);
module.exports = app;
console.log(`📡 Running on port ${PORT}`);