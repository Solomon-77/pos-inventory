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

const getArchivedProducts = async (req, res) => {
   try {
      const generic = await Generic.find({ archived: true });
      const branded = await Branded.find({ archived: true });
      const syrup = await Syrup.find({ archived: true });
      const syrup2 = await Syrup2.find({ archived: true });
      const antibiotics = await Antibiotics.find({ archived: true });
      const ointmentDrops = await OintmentDrops.find({ archived: true });
      const cosmetics = await Cosmetics.find({ archived: true });
      const diapers = await Diapers.find({ archived: true });
      const others = await Others.find({ archived: true });

      const allArchivedData = {
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

      res.status(200).json(allArchivedData);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
};

module.exports = { getArchivedProducts };