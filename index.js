const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
app.use(cors());
const port = process.env.PORT || 5000;
require("dotenv").config();
app.use(express.json());
const stripe = require("stripe")(process.env.STRIPE_SECRET);

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
app.get("/recent-product-added", (req, res) => {
  //get recent product
  client.connect(async (err) => {
    const collection = client.db("Salam_Furniture_Mart").collection("products");
    const result = collection.find({}).sort({ _id: -1 });
    const newProducts = await result.limit(3).toArray();

    if (newProducts.length > 0) {
      res.send({ products: newProducts, count: newProducts.length });
    } else {
      res.send({ products: null, count: newProducts.length });
    }
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
app.post("/buy-req", (req, res) => {
  client.connect(async (err) => {
    const collection = client
      .db("Salam_Furniture_Mart")
      .collection("AllOrders");
    const result = await collection.insertOne(req.body);
    res.send(result);
    // client.close();
  });
});
app.get("/all-orders", (req, res) => {
  //get all orders
  client.connect(async (err) => {
    const collection = client
      .db("Salam_Furniture_Mart")
      .collection("AllOrders");
    const result = collection.find({});
    const allOrders = await result.toArray();
    if (allOrders.length > 0) {
      res.send({ allOrders: allOrders, count: allOrders.length });
    } else {
      res.send({ allOrders: null, count: allOrders.length });
    }
    // client.close();
  });
});

app.get("/my-orders/:email", (req, res) => {
  //my orders
  const email = req.params.email;
  client.connect(async (err) => {
    const collection = client
      .db("Salam_Furniture_Mart")
      .collection("AllOrders");
    const result = collection.find({ email: email });
    const myOrders = await result.toArray();
    if (myOrders.length > 0) {
      res.send({ myOrders, count: myOrders.length });
    } else {
      res.send({ myOrders: null, count: myOrders.length });
    }
    // client.close();
  });
});
app.delete("/my-orders/delete/:id", (req, res) => {
  //delete an orders
  const id = req.params.id;
  const email = req.params.email;
  client.connect(async (err) => {
    const collection = client
      .db("Salam_Furniture_Mart")
      .collection("AllOrders");
    const result = await collection.deleteOne({ _id: ObjectId(id) });
    res.send(result);
    // client.close();
  });
});
app.get("/my-orders/get/:id", (req, res) => {
  //get an specific order details
  const id = req.params.id;
  client.connect(async (err) => {
    const collection = client
      .db("Salam_Furniture_Mart")
      .collection("AllOrders");
    const result = await collection.findOne({ _id: ObjectId(id) });
    res.send(result);
    // client.close();
  });
});
app.put("/my-orders/make-payment/:id", (req, res) => {
  //get an specific order details
  const id = req.params.id;
  const paymentIntent = req.body;
  client.connect(async (err) => {
    const collection = client
      .db("Salam_Furniture_Mart")
      .collection("AllOrders");
    const filter = { _id: ObjectId(id) };
    const options = { upsert: true };
    const updateData = {
      $set: {
        payStatus: "paid",
        paymentIntent,
      },
    };
    const result = await collection.updateOne(filter, updateData, options);
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

app.post("/create-payment-intent", async (req, res) => {
  const paymentInfo = req.body;
  const amount = paymentInfo.price * 100;
  const paymentIntent = await stripe.paymentIntents.create({
    currency: "usd",
    amount: amount,
    payment_method_types: ["card"],
    // automatic_payment_methods: {
    //   enabled: true,
    // },
  });
  res.json({ clientSecret: paymentIntent.client_secret });
});

app.get("/", (req, res) => {
  res.send("Welcome to Salam Furniture Mart backend");
});
app.listen(port, () => {
  console.log("lisening to port ", port);
});
