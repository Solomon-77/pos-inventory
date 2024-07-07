const Category = require('../category_models/newCategory');

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find().select('name -_id');
        res.status(200).json(categories.map(cat => cat.name));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getCategories };