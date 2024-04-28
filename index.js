require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

const cors = require("cors");
const app = express();



app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.SECRET_NAME}:${process.env.SECRET_KEY}@cluster0.6f8slkt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    const touristSpotCollection = client.db("touristDB").collection("spot");
    app.get("/touristSpots", async (req, res) => {
      const cursor = touristSpotCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get('/touristSpot', async (req, res) => {
      let query = {};
      if (req.query?.email) {
        query = { sellerEmail: req.query?.email }
      }
     
      const result = await touristSpotCollection.find(query).toArray();
      res.send(result)
    })
    app.post("/touristSpots", async (req, res) => {
      const visitor = req.body;
      console.log(visitor);
      const result = await touristSpotCollection.insertOne(visitor);
      res.send(result);
    });
    app.get("/touristSpots/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristSpotCollection.findOne(query);
      res.send(result);
    });
    app.put("/touristSpots/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedSpot = req.body;
      const options = { upsert: true };
      const spotsDoc = {
        $set: {
          touristSpot: updatedSpot.touristSpot,
          name: updatedSpot.name,
          email: updatedSpot.email,
          totalVisitor: updatedSpot.totalVisitor,
          traveltime: updatedSpot.traveltime,
          seasonality: updatedSpot.seasonality,
          cost: updatedSpot.cost,
          description: updatedSpot.description,
          location: updatedSpot.location,
          coutryName: updatedSpot.coutryName,
          photo: updatedSpot.photo
        },
      };

      const result = await touristSpotCollection.updateOne(
        filter,
        spotsDoc,
        options
      );
      res.send(result);
    });
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("My tourism management website server is running");
});
app.listen(port, () => {
  console.log(`tourism server running port is ${port}`);
});
