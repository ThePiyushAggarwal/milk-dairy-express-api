const mongoose = require('mongoose')

const orderSchema = mongoose.Schema(
  {
    costumerId: String,
    costumerName: String,
    milkQuantityInLitres: {
      type: Number,
      required: [true, 'Please enter Milk quantity ordered'],
    },
    shippingAddress: String,
    pricePerLitre: {
      type: Number,
      required: [true, 'Please enter Price per Litre of Milk today'],
    },
    finalPrice: {
      type: Number,
      required: true,
    },
    paymentMethod: String,
    deliveryDate: Date,
    orderStatus: {
      type: String,
      required: true,
      enum: ['placed', 'packed', 'dispatched', 'delivered'],
      default: 'placed',
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Order', orderSchema)
