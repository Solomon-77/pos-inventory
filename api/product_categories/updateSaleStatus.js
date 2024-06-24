const Sale = require('../category_models/sale');

const updateSaleStatus = async (req, res) => {
   try {
      const { id } = req.params;
      const { status } = req.body;

      const updatedSale = await Sale.findByIdAndUpdate(id, { status }, { new: true });

      if (!updatedSale) {
         return res.status(404).json({ message: 'Sale not found' });
      }

      res.status(200).json(updatedSale);
   } catch (error) {
      console.error('Error updating sale status:', error);
      res.status(500).json({ message: 'Error updating sale status', error: error.message });
   }
};

module.exports = { updateSaleStatus };