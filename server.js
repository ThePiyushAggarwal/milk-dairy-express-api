require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000
const connectDB = require('./config/db')
const {
  addOrder,
  updateOrderById,
  updateOrderStatus,
  deleteOrder,
  checkCapacity,
} = require('./controllers/product.controller')
const errorHandler = require('./middleware/errorHandler')

connectDB()

// Body parser
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.send(
    'Welcome to Milk Dairy API 🙏\n Browse through other requests and their description.'
  )
})

// Routes
app.post('/add', addOrder)
app.post('/update/:id', updateOrderById)
app.post('/updateStatus/:id', updateOrderStatus)
app.delete('/delete/:id', deleteOrder)
app.get('/checkCapacity/:date', checkCapacity)

app.use(errorHandler)

app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} on ${PORT}`)
)
