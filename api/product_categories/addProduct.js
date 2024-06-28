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

const addProduct = async (req, res) => {
    try {
        const { category, name, quantity, price, criticalLevel } = req.body;

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

        const newProduct = new Model({ name, quantity, price, category, criticalLevel });
        await newProduct.save();

        // Log the action
        await UserLog.create({
            user: req.user ? req.user.username : 'System',
            action: 'Added Product',
            details: `Added ${name} to ${category} category with critical level ${criticalLevel}`,
        });

        res.status(201).json(newProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { addProduct };