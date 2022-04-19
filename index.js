const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
const app = express();
app.use(cors());
const port = process.env.PORT || 5000;
require("dotenv").config();
app.use(express.json());

const uri = `mongodb+srv://${process.env.DbUser}:${process.env.DbPass}@cluster0.npegz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// client.connect((err) => {
//   const collection = client.db("Salam_Furniture_Mart").collection("devices");
//   client.close();
// });

app.get("/popular-raging-product", (req, res) => {
  client.connect(async (err) => {
    const collection = client
      .db("Salam_Furniture_Mart")
      .collection("Top_Rated_Products");
    const result = await collection.findOne({ isSelected: "true" });
    res.send(result);
  });
});

app.get("/", (req, res) => {
  res.send("Salam Furniture Mart");
});
app.listen(port, () => {
  console.log("lisening to port ", port);
});
