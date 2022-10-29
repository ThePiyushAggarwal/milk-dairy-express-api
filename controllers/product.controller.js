const Order = require('../models/order.model')
const asyncHandler = require('express-async-handler')

// Add Order
// Route /add
const addOrder = asyncHandler(async (req, res) => {
  const { milkQuantityInLitres, pricePerLitre, deliveryDate } = req.body
  // finalPrice calculation
  const finalPrice = milkQuantityInLitres * pricePerLitre
  if (!finalPrice) {
    res.status(400)
    throw new Error('Please enter all required fields')
  }
  // Delivery Date check
  if (!deliveryDate) {
    const order = await Order.create({ ...req.body, finalPrice })
    return res.json(order)
  }
  // Converting delivery date to yyyy-mm-dd and sending data to database
  const [dd, mm, yyyy] = deliveryDate.split('-')
  const order = await Order.create({
    ...req.body,
    finalPrice,
    deliveryDate: `${yyyy}-${mm}-${dd}`,
  })
  return res.json(order)
})

// Update Order Details By Id
// Route /update/:id
const updateOrderById = asyncHandler(async (req, res) => {
  const { milkQuantityInLitres, pricePerLitre, deliveryDate } = req.body
  // Check if order exists
  const { id } = req.params
  const orderExists = await Order.findById(id)
  if (!orderExists) {
    res.status(400)
    throw new Error(`Order with id "${id}" not found.`)
  }
  // finalPrice Calculation
  let finalPrice = milkQuantityInLitres * pricePerLitre
  if (!milkQuantityInLitres && pricePerLitre) {
    finalPrice = orderExists.milkQuantityInLitres * pricePerLitre
  }
  if (milkQuantityInLitres && !pricePerLitre) {
    finalPrice = milkQuantityInLitres * orderExists.pricePerLitre
  }
  // Delivery Date check
  if (!deliveryDate) {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { ...req.body, finalPrice },
      { new: true, runValidators: true }
    )
    return res.json(updatedOrder)
  }
  // Converting delivery date to yyyy-mm-dd and sending data to database
  const [dd, mm, yyyy] = deliveryDate.split('-')
  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    {
      ...req.body,
      finalPrice,
      deliveryDate: `${yyyy}-${mm}-${dd}`,
    },
    { new: true, runValidators: true }
  )
  return res.json(updatedOrder)
})

// Update Order Status By Id
// Route /updateStatus/:id
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus } = req.body
  // Check if order exists
  const { id } = req.params
  const orderExists = await Order.findById(id)
  if (!orderExists) {
    res.status(400)
    throw new Error(`Order with id "${id}" not found.`)
  }
  if (!orderStatus) {
    res.status(400)
    throw new Error('Please send "orderStatus" property in request.')
  }
  // Updating status
  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    { orderStatus },
    { new: true, runValidators: true }
  )
  return res.json(updatedOrder)
})

const deleteOrder = asyncHandler(async (req, res) => {
  const { id } = req.params
  const deleted = await Order.findByIdAndDelete(id)
  if (!deleted) {
    res.status(400)
    throw new Error('Order details not found.')
  }
  return res.json({ message: 'Order Details Deleted.' })
})

const checkCapacity = asyncHandler(async (req, res) => {
  const totalCapacity = process.env.TOTAL_CAPACITY
  const { date } = req.params
  const [dd, mm, yyyy] = date.split('-')
  const ordersOnGivenDate = await Order.find({
    deliveryDate: `${yyyy}-${mm}-${dd}`,
  })
  const quantitySoldOnDate = ordersOnGivenDate.reduce(
    (sum, order) => order.milkQuantityInLitres + sum,
    0
  )
  if (quantitySoldOnDate === 0) {
    return res.send(`All ${totalCapacity}L of milk was unsold on ${date}`)
  }
  const leftCapacity = totalCapacity - quantitySoldOnDate
  res.send(`Left milk was ${leftCapacity}L on ${date}`)
})

module.exports = {
  addOrder,
  updateOrderById,
  updateOrderStatus,
  deleteOrder,
  checkCapacity,
}
