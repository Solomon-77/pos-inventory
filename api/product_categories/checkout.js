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

const modelMap = {
   Generic,
   Branded,
   Syrup,
   Syrup2,
   Antibiotics,
   OintmentDrops,
   Cosmetics,
   Diapers,
   Others
};

const checkout = async (req, res) => {
   try {
      const { cart, discountType, total } = req.body;

      // Create a new sale
      const sale = new Sale({
         total,
         discountType,
         items: cart.map(item => ({
            productId: item._id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            category: item.category
         }))
      });

      await sale.save();

      // Update product quantities
      for (const item of cart) {
         const Model = modelMap[item.category] || Generic;
         await Model.findByIdAndUpdate(item._id, {
            $inc: { quantity: -item.quantity }
         });
      }

      res.status(200).json({ message: 'Checkout successful', saleId: sale._id });
   } catch (error) {
      console.error('Error during checkout:', error);
      res.status(500).json({ message: 'Error during checkout', error: error.message });
   }
};

module.exports = { checkout };