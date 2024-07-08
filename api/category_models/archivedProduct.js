const mongoose = require('mongoose');

const archivedProductSchema = new mongoose.Schema({
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
    },
    originalId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    originalCategory: {
        type: String,
        required: true
    },
    archivedDate: {
        type: Date,
        default: Date.now
    }
});

const ArchivedProduct = mongoose.model('ArchivedProduct', archivedProductSchema);

module.exports = ArchivedProduct;