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
    const { 
      fullName, 
      address, 
      wilaya, 
      phoneNumber, 
      product, 
      productAr, 
      price, 
      shippingPrice,
      totalPrice,
      deliveryType,
      deliveryDays,
      currency, 
      timestamp 
    } = req.body;

    console.log('=== BACKEND: Creating new order ===');
    console.log('BACKEND: Order data:', JSON.stringify(req.body, null, 2));

    // Validate required fields
    if (!fullName || !address || !wilaya || !phoneNumber || !product || !price) {
      console.log('BACKEND: Missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate phone number
    const phoneRegex = /^(05|06|07)\d{8}$/;
    if (!phoneRegex.test(phoneNumber)) {
      console.log('BACKEND: Invalid phone number format');
      return res.status(400).json({ error: 'Invalid phone number format' });
    }

    // Validate delivery type
    if (!deliveryType || !['domicile', 'stopDesk'].includes(deliveryType)) {
      console.log('BACKEND: Invalid delivery type');
      return res.status(400).json({ error: 'Invalid delivery type' });
    }

    const order = new Order({
      fullName,
      address,
      wilaya,
      phoneNumber,
      product,
      productAr,
      price,
      shippingPrice: shippingPrice || 0,
      totalPrice: totalPrice || price,
      deliveryType,
      deliveryDays,
      currency: currency || 'DZD',
      timestamp: timestamp || new Date().toISOString(),
      status: 'pending'
    });

    console.log('BACKEND: Saving order to database...');
    const savedOrder = await order.save();
    console.log('BACKEND: Order saved successfully:', savedOrder._id);
    
    res.status(201).json({ 
      success: true, 
      message: 'Order created successfully',
      order: savedOrder,
      orderId: savedOrder._id
    });
  } catch (error) {
    console.error('BACKEND: Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order', details: error.message });
  }
});

// PUT update order status
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;
    
    console.log('=== BACKEND: Updating order status ===');
    console.log('BACKEND: Order ID:', orderId);
    console.log('BACKEND: New status:', status);

    if (!['pending', 'confirmed', 'canceled', 'delivered'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
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
