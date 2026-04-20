const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const authenticateToken = require('../middleware/auth');

// GET all orders
router.get('/', authenticateToken, async (req, res) => {
  try {
    console.log('=== BACKEND: Fetching all orders ===');
    const orders = await Order.find().sort({ timestamp: -1 });
    console.log('BACKEND: Found orders:', orders.length);
    console.log('BACKEND: Orders data:', JSON.stringify(orders, null, 2));
    res.json(orders);
  } catch (error) {
    console.error('BACKEND: Error retrieving orders:', error);
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
});

// GET single order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve order' });
  }
});

// POST new order
router.post('/', async (req, res) => {
  try {
    const { fullName, address, wilaya, phoneNumber, product, productAr, price, currency, timestamp } = req.body;

    // Validate required fields
    if (!fullName || !address || !wilaya || !phoneNumber || !product || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate phone number
    const phoneRegex = /^(05|06|07)\d{8}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({ error: 'Invalid phone number format' });
    }

    const order = new Order({
      fullName,
      address,
      wilaya,
      phoneNumber,
      product,
      productAr,
      price,
      currency: currency || 'DZD',
      timestamp: timestamp || new Date().toISOString(),
      status: 'pending'
    });

    const savedOrder = await order.save();
    res.status(201).json({ 
      success: true, 
      message: 'Order created successfully',
      order: savedOrder,
      orderId: savedOrder._id
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// PUT update order status
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'confirmed', 'canceled', 'delivered'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// DELETE order
router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

module.exports = router;
