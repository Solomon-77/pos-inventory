// dataRoute.js
const { getAll } = require("../product_categories/getAll");
const { addProduct } = require("../product_categories/addProduct");
const { updateProduct } = require("../product_categories/updateProduct");
const dataRoute = require("express").Router();

dataRoute.get("/getAll", getAll);
dataRoute.post("/addProduct", addProduct);
dataRoute.put("/updateProduct", updateProduct);

module.exports = dataRoute;