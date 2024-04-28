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
const countriesData = [
    {
      "tourists_spot_name": "Grand Palace",
      "country_name": "Thailand",
      "location": "Bangkok",
      "short_description": "A stunning complex of buildings in Bangkok, once the official residence of the Kings of Siam.",
      "average_cost": "$15 per person",
      "seasonality": "Best visited during the dry season from November to February.",
      "image": "https://i.ibb.co/jJjBzCj/wat-rong-khun-temple-white-temple-chiang-rai-thailand.jpg"
    },
    {
      "tourists_spot_name": "Sundarbans Mangrove Forest",
      "country_name": "Bangladesh",
      "location": "Khulna Division",
      "short_description": "The largest mangrove forest in the world, home to the Bengal tiger and diverse wildlife.",
      "average_cost": "$20 per person for a guided boat tour",
      "seasonality": "Visit during the winter months from November to February for the best experience.",
      "image": "https://i.ibb.co/qgRzF32/tourist-walking-ang-ka-nature-trail-doi-inthanon-national-park-chiang-mai-thailand.jpg"
    },
    {
      "tourists_spot_name": "Taj Mahal",
      "country_name": "India",
      "location": "Agra",
      "short_description": "An iconic white marble mausoleum, built by Mughal Emperor Shah Jahan in memory of his wife Mumtaz Mahal.",
      "average_cost": "$25 per person",
      "seasonality": "Avoid visiting during the summer due to extreme heat. Best time is from October to March.",
      "image": "https://i.ibb.co/Yk0NxmC/fort-king-palace-kingdom-ancient.jpg"
    },
    {
      "tourists_spot_name": "Phi Phi Islands",
      "country_name": "Thailand",
      "location": "Krabi Province",
      "short_description": "A group of stunning islands known for their crystal-clear waters, coral reefs, and vibrant marine life.",
      "average_cost": "$50 per person for a day trip",
      "seasonality": "Best visited during the dry season from November to April.",
      "image": "https://i.ibb.co/ByW77Hw/woman-bikini-sitting-viewpoint-nang-yuan-island-thailand.jpg"
    },
    {
      "tourists_spot_name": "Cox's Bazar Beach",
      "country_name": "Bangladesh",
      "location": "Chittagong Division",
      "short_description": "The longest natural sea beach in the world, stretching over 120 kilometers.",
      "average_cost": "Free, but expect to pay for accommodations and activities.",
      "seasonality": "Visit during the winter months for pleasant weather.",
      "image": "https://i.ibb.co/kGCyCLT/beautiful-tropical-beach-sea.jpg"
    },
    {
      "tourists_spot_name": "Jaipur City Palace",
      "country_name": "India",
      "location": "Jaipur",
      "short_description": "A magnificent palace complex showcasing the rich history and architecture of Rajasthan.",
      "average_cost": "$10 per person",
      "seasonality": "Best visited during the winter months for pleasant weather.",
      "image": "https://i.ibb.co/5RvZ0jK/beautiful-shot-udaipur-from-window-city-palace.jpg"
    }
  ]


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    const touristSpotCollection = client.db("touristDB").collection("spot");
    // const countriesCollection = client.db('touristDB').collection('countries');
    // await countriesCollection.insertMany(countriesData);
    app.get("/touristSpots", async (req, res) => {
      const cursor = touristSpotCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // app.get('/countries',async(req,res)=>{
    //   const cursor = countriesCollection.find();
    //   const result = await cursor.toArray();
    //   res.send(result);
    // })
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
      // console.log(visitor);
      const result = await touristSpotCollection.insertOne(visitor);
      res.send(result);
    });
    app.get("/touristSpots/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await touristSpotCollection.findOne(query);
      res.send(result);
    });
    app.delete('/touristSpots/:id',async(req,res)=>{
      const id = req.params.id;
    const query = {_id: new ObjectId(id)}
    const result = await touristSpotCollection.deleteOne(query);
    res.send(result)
    })
    app.put("/touristSpots/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedSpot = req.body;
      const options = { upsert: true };
      const spotsDoc = {
        $set: {
          touristSpot: updatedSpot.touristSpot,
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
