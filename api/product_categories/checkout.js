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

const checkout = async (req, res) => {
   try {
      const { cart, discountType, total, amountPaid } = req.body;

      // Create a new sale
      const newSale = new Sale({
         total,
         discountType,
         items: cart.map(item => ({
            productId: item._id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            category: item.category
         })),
         amountPaid,
         change: amountPaid - total,
         status: 'successful'
      });

      await newSale.save();

      // Update inventory
      for (const item of cart) {
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

         await Model.findByIdAndUpdate(item._id, { $inc: { quantity: -item.quantity } });
      }

      res.status(200).json({ message: 'Checkout successful', saleId: newSale._id });
   } catch (error) {
      console.error('Error during checkout:', error);
      res.status(500).json({ message: 'Error during checkout', error: error.message });
   }
};

module.exports = { checkout };