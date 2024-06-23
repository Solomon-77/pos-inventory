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

const updateProduct = async (req, res) => {
   try {
      const { category, currentName, newName, quantity, price } = req.body;

      let Model;
      switch (category.toLowerCase()) {
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

      const product = await Model.findOne({ name: currentName, category });
      if (!product) {
         return res.status(404).json({ error: 'Product not found' });
      }

      if (newName !== undefined) product.name = newName;
      if (quantity !== undefined) product.quantity = quantity;
      if (price !== undefined) product.price = price;

      await product.save();

      res.status(200).json(product);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
};

module.exports = { updateProduct };