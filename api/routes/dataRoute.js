const { getAll } = require("../product_categories/getAll");
const { addProduct } = require("../product_categories/addProduct");
const { updateProduct } = require("../product_categories/updateProduct");
const { checkout } = require("../product_categories/checkout");
const { getSales } = require("../product_categories/getSales");
const { updateSaleStatus } = require("../product_categories/updateSaleStatus");

const dataRoute = require("express").Router();

dataRoute.get("/getAll", getAll);
dataRoute.post("/addProduct", addProduct);
dataRoute.put("/updateProduct", updateProduct);
dataRoute.post("/checkout", checkout);
dataRoute.get("/getSales", getSales);
dataRoute.put("/updateSaleStatus/:id", updateSaleStatus);

module.exports = dataRoute;