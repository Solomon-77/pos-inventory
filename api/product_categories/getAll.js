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

const getAll = async (req, res) => {
   try {
      const generic = await Generic.find();
      const branded = await Branded.find();
      const syrup = await Syrup.find();
      const syrup2 = await Syrup2.find();
      const antibiotics = await Antibiotics.find();
      const ointmentDrops = await OintmentDrops.find();
      const cosmetics = await Cosmetics.find();
      const diapers = await Diapers.find();
      const others = await Others.find();

      const allData = {
         generic,
         branded,
         syrup,
         syrup2,
         antibiotics,
         ointmentDrops,
         cosmetics,
         diapers,
         others
      };

      res.status(200).json(allData);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
};

module.exports = { getAll };