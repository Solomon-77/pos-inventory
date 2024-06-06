require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
   .then(() => console.log("MongoDB Connected."))
   .catch(err => console.log("MongoDB Connection Error: ", err));

const route = require("./routes/authRoute");
app.use(route);

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));