const Sale = require('../category_models/sale');
const { recalculateRevenue } = require('./updateSaleStatus');
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

const returnStock = async (req, res) => {
   try {
      const { id } = req.params;
      const sale = await Sale.findById(id);
      if (!sale) {
         return res.status(404).json({ message: 'Sale not found' });
      }
      if (sale.status !== 'voided') {
         return res.status(400).json({ message: 'Only voided sales can be returned' });
      }
      if (sale.returnedToInventory) {
         return res.status(400).json({ message: 'Stock has already been returned' });
      }

      // Return inventory
      for (const item of sale.items) {
         let Model;
         switch (item.category.toLowerCase()) {
            case 'generic': Model = Generic; break;
            case 'branded': Model = Branded; break;
            case 'syrup': Model = Syrup; break;
            case 'syrup 2': Model = Syrup2; break;
            case 'antibiotics': Model = Antibiotics; break;
            case 'ointments-drops': Model = OintmentDrops; break;
            case 'cosmetics': Model = Cosmetics; break;
            case 'diapers': Model = Diapers; break;
            case 'others': Model = Others; break;
            default:
               return res.status(400).json({ error: 'Invalid category' });
         }
         await Model.findByIdAndUpdate(item.productId, { $inc: { quantity: item.quantity } });
      }

      // Mark as returned to inventory
      sale.returnedToInventory = true;
      await sale.save();

      const revenueStats = await recalculateRevenue();
      res.status(200).json({ updatedSale: sale, revenueStats });
   } catch (error) {
      console.error('Error returning stock:', error);
      res.status(500).json({ message: 'Error returning stock', error: error.message });
   }
};

module.exports = { returnStock };