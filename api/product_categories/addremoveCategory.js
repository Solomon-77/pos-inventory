const Category = require('../category_models/newCategory');
const UserLog = require('../model/UserLog');

const addCategory = async (req, res) => {
    try {
        const { category } = req.body;
        const newCategory = new Category({ name: category });
        await newCategory.save();

        await UserLog.create({
            user: req.user ? req.user.username : 'System',
            action: 'Added Category',
            details: `Added new category: ${category}`,
        });

        res.status(201).json({ message: 'Category added successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const removeCategory = async (req, res) => {
    try {
        const { category } = req.body;
        await Category.findOneAndDelete({ name: category });

        await UserLog.create({
            user: req.user ? req.user.username : 'System',
            action: 'Removed Category',
            details: `Removed category: ${category}`,
        });

        res.status(200).json({ message: 'Category removed successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { addCategory, removeCategory };