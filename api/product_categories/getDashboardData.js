// File: product_categories/getDashboardData.js

const Sale = require('../category_models/sale');
const {
   Generic,
   Branded,
   Syrup,
   Syrup2,
   Antibiotics,
   OintmentDrops,
   Cosmetics,
   Diapers,
   Others
} = require('../category_models/category');

const getDashboardData = async (req, res) => {
   try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const dailySales = await Sale.aggregate([
         { $match: { date: { $gte: today } } },
         { $group: { _id: null, total: { $sum: '$total' } } }
      ]);

      const inventoryCount = await Promise.all([
         Generic.countDocuments(),
         Branded.countDocuments(),
         Syrup.countDocuments(),
         Syrup2.countDocuments(),
         Antibiotics.countDocuments(),
         OintmentDrops.countDocuments(),
         Cosmetics.countDocuments(),
         Diapers.countDocuments(),
         Others.countDocuments()
      ]).then(counts => counts.reduce((a, b) => a + b, 0));

      const ordersToday = await Sale.countDocuments({ date: { $gte: today } });

      const topSelling = await Sale.aggregate([
         { $unwind: '$items' },
         { $group: { _id: '$items.name', totalSold: { $sum: '$items.quantity' } } },
         { $sort: { totalSold: -1 } },
         { $limit: 1 }
      ]);

      const recentOrders = await Sale.find().sort({ date: -1 }).limit(5);

      const lowStockItems = await Promise.all([
         Generic.find({ quantity: { $lt: 10 } }),
         Branded.find({ quantity: { $lt: 10 } }),
         Syrup.find({ quantity: { $lt: 10 } }),
         Syrup2.find({ quantity: { $lt: 10 } }),
         Antibiotics.find({ quantity: { $lt: 10 } }),
         OintmentDrops.find({ quantity: { $lt: 10 } }),
         Cosmetics.find({ quantity: { $lt: 10 } }),
         Diapers.find({ quantity: { $lt: 10 } }),
         Others.find({ quantity: { $lt: 10 } })
      ]).then(results => results.flat());

      const expiredStocks = await Promise.all([
         Generic.find({ expiryDate: { $lt: today } }),
         Branded.find({ expiryDate: { $lt: today } }),
         Syrup.find({ expiryDate: { $lt: today } }),
         Syrup2.find({ expiryDate: { $lt: today } }),
         Antibiotics.find({ expiryDate: { $lt: today } }),
         OintmentDrops.find({ expiryDate: { $lt: today } }),
         Cosmetics.find({ expiryDate: { $lt: today } }),
         Diapers.find({ expiryDate: { $lt: today } }),
         Others.find({ expiryDate: { $lt: today } })
      ]).then(results => results.flat());

      const weeklySales = await Sale.aggregate([
         {
            $match: {
               date: { $gte: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000) }
            }
         },
         {
            $group: {
               _id: { $dayOfWeek: '$date' },
               sales: { $sum: '$total' }
            }
         },
         {
            $project: {
               day: {
                  $switch: {
                     branches: [
                        { case: { $eq: ['$_id', 1] }, then: 'Sun' },
                        { case: { $eq: ['$_id', 2] }, then: 'Mon' },
                        { case: { $eq: ['$_id', 3] }, then: 'Tue' },
                        { case: { $eq: ['$_id', 4] }, then: 'Wed' },
                        { case: { $eq: ['$_id', 5] }, then: 'Thu' },
                        { case: { $eq: ['$_id', 6] }, then: 'Fri' },
                        { case: { $eq: ['$_id', 7] }, then: 'Sat' }
                     ],
                     default: 'Unknown'
                  }
               },
               sales: 1
            }
         },
         { $sort: { _id: 1 } }
      ]);

      res.status(200).json({
         dailySales: dailySales[0]?.total || 0,
         inventoryCount,
         ordersToday,
         topSellingItem: topSelling[0]?._id || 'N/A',
         recentOrders: recentOrders.map(order => ({ id: order._id, total: order.total })),
         lowStockItems: lowStockItems.map(item => ({ name: item.name, quantity: item.quantity })),
         expiredStocks: expiredStocks.map(item => ({ name: item.name, expiryDate: item.expiryDate })),
         weeklySales
      });
   } catch (error) {
      console.error('Error fetching dashboard data:', error);
      res.status(500).json({ message: 'Error fetching dashboard data', error: error.message });
   }
};

module.exports = { getDashboardData };