const { Schema, model } = require('mongoose');

const saleItemSchema = new Schema({
   productId: {
      type: Schema.Types.ObjectId,
      required: true
   },
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
   }
});

const saleSchema = new Schema({
   date: {
      type: Date,
      default: Date.now
   },
   total: {
      type: Number,
      required: true
   },
   discountType: {
      type: String,
      enum: ['', 'senior', 'pwd'],
      default: ''
   },
   items: [saleItemSchema],
   status: {
      type: String,
      enum: ['successful', 'voided'],
      default: 'successful'
   },
   amountPaid: {
      type: Number,
      required: true
   },
   change: {
      type: Number,
      required: true
   }
});

const Sale = model('Sale', saleSchema);

module.exports = Sale;