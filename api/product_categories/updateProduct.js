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
const UserLog = require('../model/UserLog');

const updateProduct = async (req, res) => {
   try {
      const { category, currentName, newName, quantity, price, criticalLevel } = req.body;

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

      let updateDetails = [];
      if (newName !== undefined && newName !== product.name) {
         updateDetails.push(`name from ${product.name} to ${newName}`);
         product.name = newName;
      }
      if (quantity !== undefined && quantity !== product.quantity) {
         updateDetails.push(`quantity from ${product.quantity} to ${quantity}`);
         product.quantity = quantity;
      }
      if (price !== undefined && price !== product.price) {
         updateDetails.push(`price from ${product.price} to ${price}`);
         product.price = price;
      }
      if (criticalLevel !== undefined && criticalLevel !== product.criticalLevel) {
         updateDetails.push(`critical level from ${product.criticalLevel} to ${criticalLevel}`);
         product.criticalLevel = criticalLevel;
      }

      await product.save();

      // Log the action
      if (updateDetails.length > 0) {
         await UserLog.create({
            user: req.user ? req.user.username : 'System',
            action: 'Updated Product',
            details: `Updated ${currentName} in ${category} category: ${updateDetails.join(', ')}`,
         });
      }

      res.status(200).json(product);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
};

module.exports = { updateProduct };