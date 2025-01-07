require("dotenv").config();
var express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
var cors = require('cors')
var app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.amvbb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
   
    // await client.connect();

    const database = client.db("sportsDB");
    const sportsCollection =database.collection("sports");


    app.get('/equipments',async(req,res)=>{
      const cursor = sportsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/api/equipments', async (req, res) => {
      
        const userEmail = req.query.email;
        
          const query = { email: userEmail };
        const  result = await sportsCollection.find(query).toArray();

        res.send(result);
        })







    app.get('/equipments/:id',async(req,res)=>{
      const id = req.params.id;
     
      const query = {_id:new ObjectId(id)}
      const result = await sportsCollection.findOne(query);
      res.send(result)
  })

   

    app.put('/equipments/:id',async(req,res)=>{
      const id = req.params.id;
      
      const filter = {_id:new ObjectId(id)}
      const options = { upsert: true };
      const updatedDoc = {
          $set: req.body
      }

      const result = await sportsCollection.updateOne(filter,updatedDoc,options);
      res.send(result)
  })



  app.delete('/equipments/:id',async(req,res)=>{
            const id = req.params.id;
          
            const query = { _id: new ObjectId(id) }
            const result = await sportsCollection.deleteOne(query);
            res.send(result);
  })


    app.post('/equipments',async(req,res)=>{
      const equipments = req.body;
     const result = await sportsCollection.insertOne(equipments);
     res.send(result)
    })




    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);







app.get('/',(req,res)=>{
    res.send('server is working')
})

app.listen(port,()=>{
    console.log(`node is running on port: ${port}`)
})


