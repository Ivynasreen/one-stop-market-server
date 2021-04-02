const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9d6zf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log(err)
  const productCollection = client.db("superMarket").collection("grocery");
  const orderCollection = client.db("superMarket").collection("order");
    console.log("database connected")

    app.get('/products', (req, res) => {
      productCollection.find()
      .toArray((err, items) => {
        console.log('from database' , items)
        res.send(items)
      })
    })
    app.get('/product:id', (req, res) => {
      productCollection.find({id: req.params.id})
      .toArray((err, documents) => {
        console.log(documents)
        res.send(documents[0])
      })
    })

  app.post('/addProduct' , (req,res)=> {
        const newProduct = req.body;
        console.log('adding new product:' , newProduct)
        productCollection.insertOne(newProduct)
        .then(result => {
            console.log('inserted count' , result.insertedCount)
            res.send(result.insertedCount > 0)
        })
    })

    app.post('/addOrder' , (req, res) => {
      const  newOrder = req.body;
      orderCollection.insertOne(newOrder)
      .then(result => {
        res.send(result.insertedCount > 0);
      })
      console.log(newOrder)
    })

    app.get('/orders' , (req , res) => {
      console.log(req.query.email)
      orderCollection.find({email: req.query.email})
      .toArray((err , documents) => {
        console.log(err, documents)
        res.send(documents)
      })
    })

    app.post('/addManageProducts' , (req, res) => {
      const  newOrder = req.body;
     productCollection.insertOne(newOrder)
      .then(result => {
        res.send(result.insertedCount > 0);
      })
      console.log(newOrder)
    })
    app.get('/manageProducts' , (req , res) => {
      productCollection.find({email: req.query.email})
      .toArray((err , documents) => {
        res.send(documents)
      })
    })

});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

