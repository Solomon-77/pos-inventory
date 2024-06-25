const Sale = require('../category_models/sale');

const getRevenueStatistics = async (req, res) => {
   try {
       const today = new Date();
       today.setHours(0, 0, 0, 0);
       const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
       const oneMonthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

       const dailyRevenue = await Sale.aggregate([
           { $match: { date: { $gte: today }, status: 'paid' } },
           { $group: { _id: null, total: { $sum: '$total' } } }
       ]);

       const weeklyRevenue = await Sale.aggregate([
           { $match: { date: { $gte: oneWeekAgo }, status: 'paid' } },
           { $group: { _id: null, total: { $sum: '$total' } } }
       ]);

       const monthlyRevenue = await Sale.aggregate([
           { $match: { date: { $gte: oneMonthAgo }, status: 'paid' } },
           { $group: { _id: null, total: { $sum: '$total' } } }
       ]);

       res.status(200).json({
           dailyRevenue: dailyRevenue[0]?.total || 0,
           weeklyRevenue: weeklyRevenue[0]?.total || 0,
           monthlyRevenue: monthlyRevenue[0]?.total || 0
       });
   } catch (error) {
       console.error('Error fetching revenue statistics:', error);
       res.status(500).json({ message: 'Error fetching revenue statistics', error: error.message });
   }
};

module.exports = { getRevenueStatistics };