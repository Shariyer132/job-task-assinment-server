const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config();
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fbkj2kv.mongodb.net/?retryWrites=true&w=majority`;
const uri = `mongodb+srv://final-assignment-user:1NrbKUhIdVlu9kKJ@cluster0.fbkj2kv.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const tasksCollections = client.db("TaskManagement").collection("tasks");

    app.get('/tasks', async (req, res) => {
      const result = await tasksCollections.find().toArray();
      res.send(result)
    })

    app.post('/tasks', async (req, res) => {
      const task = req.body;
      const result = await tasksCollections.insertOne(task)
      res.send(result)
    })

    app.patch('/tasks/:id', async (req, res) => {
      const id = req.params.id;
      const status = req.body.status
      console.log(req.body);
      const filter = { _id: new ObjectId(id) }
      const updateDoc = {
        $set: {
          status
        }
      }
      const result = await tasksCollections.updateOne(filter, updateDoc);
      res.send(result)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})