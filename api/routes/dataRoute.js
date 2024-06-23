const { getAll } = require("../product_categories/getAll");
const dataRoute = require("express").Router();

dataRoute.get("/getAll", getAll);

module.exports = dataRoute;