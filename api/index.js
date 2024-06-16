require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const axios = require('axios');
const app = express();

app.use(cors({
   origin: process.env.CLIENT_DOMAIN,
   credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {
   res.send("Server is running.");
});

app.get("/keep-warm", (req, res) => {
   res.status(200).send("OK");

   const nextInterval = randomInterval(210000, 300000);
   setTimeout(pingServer, nextInterval);
});

function randomInterval(min, max) {
   return Math.floor(Math.random() * (max - min + 1) + min);
}

function pingServer() {
   axios.get(process.env.KEEP_WARM_DOMAIN)
      .then(() => console.log("Server self-pinged successfully"))
      .catch(err => console.error("Error self-pinging server:", err));

   const nextInterval = randomInterval(210000, 300000);
   setTimeout(pingServer, nextInterval);
}

mongoose.connect(process.env.MONGODB_URI)
   .then(() => console.log("MongoDB Connected."))
   .catch(err => console.log("MongoDB Connection Error: ", err));

const route = require("./routes/authRoute");
app.use(route);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
