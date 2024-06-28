const { Schema, model } = require('mongoose');

const baseSchema = {
   name: {
      type: String,
      required: true
   },
   quantity: {
      type: Number,
      required: true
   },
   price: {
      type: Number,
      required: true
   },
   category: {
      type: String,
      required: true
   },
   criticalLevel: {
      type: Number,
      default: 20
   }
};

const createSchema = (additionalFields = {}) => {
   const schema = new Schema({
      ...baseSchema,
      ...additionalFields
   });
   return schema;
};

// Generic model
const genericSchema = createSchema();
const Generic = model('Generic', genericSchema);

// Branded model
const brandedSchema = createSchema({ brand: { type: String, required: true } });
const Branded = model('Branded', brandedSchema, 'branded');

// Syrup model
const syrupSchema = createSchema();
const Syrup = model('Syrup', syrupSchema, 'syrup');

// Syrup2 model
const syrup2Schema = createSchema();
const Syrup2 = model('Syrup2', syrup2Schema);

// Antibiotics model
const antibioticsSchema = createSchema();
const Antibiotics = model('Antibiotics', antibioticsSchema);

// Ointment-Drops model
const ointmentDropsSchema = createSchema();
const OintmentDrops = model('OintmentDrops', ointmentDropsSchema, 'ointment-drops');

// Cosmetics model
const cosmeticsSchema = createSchema();
const Cosmetics = model('Cosmetics', cosmeticsSchema);

// Diapers model
const diapersSchema = createSchema();
const Diapers = model('Diapers', diapersSchema);

// Others model
const othersSchema = createSchema();
const Others = model('Others', othersSchema);

module.exports = {
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