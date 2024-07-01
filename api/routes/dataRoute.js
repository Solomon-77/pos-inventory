const { getAll } = require("../product_categories/getAll");
const { addProduct } = require("../product_categories/addProduct");
const { updateProduct } = require("../product_categories/updateProduct");
const { checkout } = require("../product_categories/checkout");
const { getSales } = require("../product_categories/getSales");
const { updateSaleStatus } = require("../product_categories/updateSaleStatus");
const { getDashboardData } = require("../product_categories/getDashboardData");
const { getRevenueStatistics } = require("../product_categories/getRevenueStatistics");
const { voidSale } = require("../product_categories/voidSale");
const { returnStock } = require("../product_categories/returnStock");

const dataRoute = require("express").Router();

dataRoute.get("/getAll", getAll);
dataRoute.post("/addProduct", addProduct);
dataRoute.put("/updateProduct", updateProduct);
dataRoute.post("/checkout", checkout);
dataRoute.get("/getSales", getSales);
dataRoute.put("/updateSaleStatus/:id", updateSaleStatus);
dataRoute.get("/dashboardData", getDashboardData);
dataRoute.get("/revenueStatistics", getRevenueStatistics);
dataRoute.post('/voidSale/:id', voidSale);
dataRoute.post('/returnStock/:id', returnStock);

module.exports = dataRoute;