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
    // client.close();
  });
});
app.post("/product", (req, res) => {
  client.connect(async (err) => {
    const collection = client.db("Salam_Furniture_Mart").collection("products");
    const result = await collection.insertOne(req.body);
    res.send(result);
    // client.close();
  });
});
app.get("/product/3/:type", (req, res) => {
  const type = req.params.type;
  client.connect(async (err) => {
    const collection = client.db("Salam_Furniture_Mart").collection("products");
    const result = collection.find({ pType: type });
    const product3 = await result.limit(3).toArray();
    if (product3.length > 0) {
      res.send({ products: product3, count: product3.length });
    } else {
      res.send({ products: null, count: product3.length });
    }
    // client.close();
  });
});
app.get("/product/:productId", (req, res) => {
  const id = req.params.productId;
  client.connect(async (err) => {
    const collection = client.db("Salam_Furniture_Mart").collection("products");
    const result = await collection.findOne({ pId: id });
    res.send(result);
    // client.close();
  });
});
app.get("/products/:productType", (req, res) => {
  const type = req.params.productType;
  client.connect(async (err) => {
    const collection = client.db("Salam_Furniture_Mart").collection("products");
    const result = collection.find({ pType: type });
    const products = await result.toArray();
    if (products.length > 0) {
      res.send({ products, count: products.length });
    } else {
      res.send({ products: null, count: products.length });
    }
    // client.close();
  });
});
app.get("/product-count/:type", (req, res) => {
  const type = req.params.type;
  client.connect(async (err) => {
    const collection = client.db("Salam_Furniture_Mart").collection("products");
    const result = collection.find({ pType: type });
    const countArr = await result.toArray();
    res.send({ productCount: countArr.length });
    // client.close();
  });
});
app.post("/userdata", (req, res) => {
  client.connect(async (err) => {
    const collection = client.db("Salam_Furniture_Mart").collection("UserData");
    const result = await collection.insertOne(req.body);
    res.send(result);
    // client.close();
  });
});
app.get("/isadmin/:email", (req, res) => {
  const email = req.params.email;
  client.connect(async (err) => {
    const collection = client.db("Salam_Furniture_Mart").collection("UserData");
    const result = await collection.findOne({ email: email });
    if (result) {
      if (result.role === "admin") {
        res.send({ isAdmin: true });
      } else {
        res.send({ isAdmin: false });
      }
    } else {
      res.send({ isAdmin: null });
    }
    // client.close();
  });
});

app.get("/", (req, res) => {
  res.send("Salam Furniture Mart");
});
app.listen(port, () => {
  console.log("lisening to port ", port);
});
