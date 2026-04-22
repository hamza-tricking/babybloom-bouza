const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  wilaya: {
    type: String,
    required: true,
    trim: true
  },
  deliveryType: {
    type: String,
    enum: ['domicile', 'stopDesk'],
    required: true,
    default: 'domicile'
  },
  phoneNumber: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^(05|06|07)\d{8}$/.test(v);
      },
      message: 'Invalid Algerian phone number format'
    }
  },
  product: {
    type: String,
    required: true,
    trim: true
  },
  productAr: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  shippingPrice: {
    type: Number,
    required: true,
    min: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  deliveryDays: {
    type: String,
    trim: true
  },
  currency: {
    type: String,
    default: 'DZD'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'canceled', 'delivered'],
    default: 'pending'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
