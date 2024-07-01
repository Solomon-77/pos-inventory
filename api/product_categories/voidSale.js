const Sale = require('../category_models/sale');
const { recalculateRevenue } = require('./updateSaleStatus');

const voidSale = async (req, res) => {
   try {
      const { id } = req.params;
      const { reason } = req.body;
      const sale = await Sale.findById(id);
      if (!sale) {
         return res.status(404).json({ message: 'Sale not found' });
      }
      if (sale.status === 'voided') {
         return res.status(400).json({ message: 'Sale is already voided' });
      }
      
      // Update sale status to voided and add reason
      sale.status = 'voided';
      sale.voidReason = reason;
      sale.returnedToInventory = false; // Add this new field
      await sale.save();
      
      const revenueStats = await recalculateRevenue();
      res.status(200).json({ updatedSale: sale, revenueStats });
   } catch (error) {
      console.error('Error voiding sale:', error);
      res.status(500).json({ message: 'Error voiding sale', error: error.message });
   }
};

module.exports = { voidSale };