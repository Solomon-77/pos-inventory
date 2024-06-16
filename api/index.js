require("dotenv").config();
const express = require("express");
const cors = require("cors")
const mongoose = require("mongoose");
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
});

mongoose.connect(process.env.MONGODB_URI)
   .then(() => console.log("MongoDB Connected."))
   .catch(err => console.log("MongoDB Connection Error: ", err));

const route = require("./routes/authRoute");
app.use(route);

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));