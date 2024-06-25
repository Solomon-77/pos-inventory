const Sale = require('../category_models/sale');

const recalculateRevenue = async () => {
   const today = new Date();
   today.setHours(0, 0, 0, 0);
   const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
   const oneMonthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

   const [dailyRevenue, weeklyRevenue, monthlyRevenue] = await Promise.all([
      Sale.aggregate([
         { $match: { date: { $gte: today }, status: 'paid' } },
         { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      Sale.aggregate([
         { $match: { date: { $gte: oneWeekAgo }, status: 'paid' } },
         { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      Sale.aggregate([
         { $match: { date: { $gte: oneMonthAgo }, status: 'paid' } },
         { $group: { _id: null, total: { $sum: '$total' } } }
      ])
   ]);

   return {
      dailyRevenue: dailyRevenue[0]?.total || 0,
      weeklyRevenue: weeklyRevenue[0]?.total || 0,
      monthlyRevenue: monthlyRevenue[0]?.total || 0
   };
};

const updateSaleStatus = async (req, res) => {
   try {
      const { id } = req.params;
      const { status } = req.body;

      const updatedSale = await Sale.findByIdAndUpdate(id, { status }, { new: true });

      if (!updatedSale) {
         return res.status(404).json({ message: 'Sale not found' });
      }

      const revenueStats = await recalculateRevenue();

      res.status(200).json({ updatedSale, revenueStats });
   } catch (error) {
      console.error('Error updating sale status:', error);
      res.status(500).json({ message: 'Error updating sale status', error: error.message });
   }
};

module.exports = { updateSaleStatus };