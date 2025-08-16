const router = require('express').Router();
const { Order, OrderItem, Product, User } = require('../../models');
const { requireAuth, allowRoles } = require('../middleware/auth');

// List orders: admin sees all, others see their own
router.get('/', requireAuth, async (req, res) => {
    try {
        const where = req.user.role === 'admin' ? {} : { userId: req.user.id };
        const orders = await Order.findAll({
            where,
            include: [
                {
                    model: Product,
                    as: 'products',
                    through: { attributes: ['quantity', 'unitPrice'] }
                },
                { model: User, attributes: ['email', 'role'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new order: customer or admin
router.post('/', requireAuth, allowRoles('customer', 'admin'), async (req, res) => {
    try {
        const { items } = req.body; // [{productId, quantity}]
        if (!Array.isArray(items) || items.length === 0)
            return res.status(400).json({ message: 'items required' });

        // Fetch products
        const ids = items.map(i => i.productId);
        const products = await Product.findAll({ where: { id: ids } });
        if (products.length !== items.length)
            return res.status(400).json({ message: 'Invalid productId(s)' });

        // Create order with initial totalAmount = 0 and valid status
        const order = await Order.create({
            userId: req.user.id,
            status: 'pending',
            totalAmount: 0
        });

        // Calculate total and create OrderItems
        let totalAmount = 0;
        for (const it of items) {
            const product = products.find(p => p.id === it.productId);
            const quantity = Math.max(1, parseInt(it.quantity || 1));
            const unitPrice = Number(product.price);
            totalAmount += unitPrice * quantity;

            await OrderItem.create({
                orderId: order.id,
                productId: product.id,
                quantity,
                unitPrice
            });
        }

        // Update order totalAmount
        await order.update({ totalAmount });

        // Return full order with products
        const fullOrder = await Order.findByPk(order.id, {
            include: [
                {
                    model: Product,
                    as: 'products',
                    through: { attributes: ['quantity', 'unitPrice'] }
                },
                { model: User, attributes: ['email', 'role'] }
            ]
        });

        res.status(201).json(fullOrder);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single order
router.get('/:id', requireAuth, async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id, {
            include: [
                {
                    model: Product,
                    as: 'products',
                    through: { attributes: ['quantity', 'unitPrice'] }
                },
                { model: User, attributes: ['email', 'role'] }
            ]
        });
        if (!order) return res.status(404).json({ message: 'Not found' });
        if (req.user.role !== 'admin' && order.userId !== req.user.id)
            return res.status(403).json({ message: 'Forbidden' });
        res.json(order);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update order status: admin only
router.put('/:id', requireAuth, allowRoles('admin'), async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);
        if (!order) return res.status(404).json({ message: 'Not found' });

        // Only allow valid enum values
        const validStatuses = ['pending', 'completed', 'cancelled'];
        const status = req.body.status;
        if (status && !validStatuses.includes(status))
            return res.status(400).json({ message: 'Invalid status' });

        await order.update({ status: status ?? order.status });
        res.json(order);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete order: admin only
router.delete('/:id', requireAuth, allowRoles('admin'), async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);
        if (!order) return res.status(404).json({ message: 'Not found' });
        await order.destroy();
        res.status(204).end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
