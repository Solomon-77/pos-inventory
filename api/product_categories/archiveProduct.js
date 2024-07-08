const mongoose = require('mongoose');
const ArchivedProduct = require('../category_models/archivedProduct');
const UserLog = require('../model/UserLog');

const archiveProduct = async (req, res) => {
   try {
      const { id, category } = req.body;

      // Find the product in the appropriate collection
      const Model = mongoose.model(category.charAt(0).toUpperCase() + category.slice(1));
      const product = await Model.findById(id);

      if (!product) {
         return res.status(404).json({ error: 'Product not found' });
      }

      // Create a new archived product
      const archivedProduct = new ArchivedProduct({
         name: product.name,
         price: product.price,
         quantity: product.quantity,
         category: product.category,
         criticalLevel: product.criticalLevel,
         originalId: product._id,
         originalCategory: category
      });

      await archivedProduct.save();

      // Remove the product from the original collection
      await Model.findByIdAndDelete(id);

      // Log the action
      await UserLog.create({
         user: req.user ? req.user.username : 'System',
         action: 'Archived Product',
         details: `Archived ${product.name} from ${category} category`,
      });

      res.status(200).json({ message: 'Product archived successfully' });
   } catch (err) {
      console.error("Error archiving product:", err);
      res.status(500).json({ error: err.message });
   }
};

const unarchiveProduct = async (req, res) => {
   try {
      const { id } = req.body;

      // Find the archived product
      const archivedProduct = await ArchivedProduct.findById(id);

      if (!archivedProduct) {
         return res.status(404).json({ error: 'Archived product not found' });
      }

      // Find the appropriate model for the original category
      const Model = mongoose.model(archivedProduct.originalCategory.charAt(0).toUpperCase() + archivedProduct.originalCategory.slice(1));

      // Create a new product in the original collection
      const newProduct = new Model({
         name: archivedProduct.name,
         price: archivedProduct.price,
         quantity: archivedProduct.quantity,
         category: archivedProduct.category,
         criticalLevel: archivedProduct.criticalLevel
      });

      await newProduct.save();

      // Remove the product from the archived collection
      await ArchivedProduct.findByIdAndDelete(id);

      // Log the action
      await UserLog.create({
         user: req.user ? req.user.username : 'System',
         action: 'Unarchived Product',
         details: `Unarchived ${archivedProduct.name} to ${archivedProduct.originalCategory} category`,
      });

      res.status(200).json({ message: 'Product unarchived successfully' });
   } catch (err) {
      console.error("Error unarchiving product:", err);
      res.status(500).json({ error: err.message });
   }
};

const getArchivedProducts = async (req, res) => {
   try {
      const archivedProducts = await ArchivedProduct.find();
      res.status(200).json(archivedProducts);
   } catch (err) {
      console.error("Error fetching archived products:", err);
      res.status(500).json({ error: err.message });
   }
};

module.exports = { archiveProduct, unarchiveProduct, getArchivedProducts };