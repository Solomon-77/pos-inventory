const Sale = require('../category_models/sale');

const getSales = async (req, res) => {
   try {
      const sales = await Sale.find()
         .sort({ date: -1 })
         .select('date total discountType items status amountPaid change voidReason returnedToInventory');

      console.log('Retrieved sales:', sales); // Keep this line for debugging

      res.status(200).json(sales);
   } catch (error) {
      console.error('Error fetching sales:', error);
      res.status(500).json({ message: 'Error fetching sales', error: error.message });
   }
};

module.exports = { getSales };