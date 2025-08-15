const router = require('express').Router();
const { Order, OrderItem, Product, User } = require('../../models');
const { requireAuth, allowRoles } = require('../middleware/auth');

// List: admin sees all; others see own
router.get('/', requireAuth, async (req, res) => {
    const where = req.user.role === 'admin' ? {} : { userId: req.user.id };
    const orders = await Order.findAll({
        where,
        include: [
            { model: Product, through: { attributes: ['quantity', 'unitPrice'] } },
            { model: User, attributes: ['email', 'role'] }
        ]
    });
    res.json(orders);
});

// Create: customer or admin
router.post('/', requireAuth, allowRoles('customer', 'admin'), async (req, res) => {
    const { items } = req.body; // [{productId, quantity}]
    if (!Array.isArray(items) || items.length === 0)
        return res.status(400).json({ message: 'items required' });

    const ids = items.map(i => i.productId);
    const products = await Product.findAll({ where: { id: ids } });
    if (products.length !== items.length)
        return res.status(400).json({ message: 'Invalid productId(s)' });

    let total = 0;
    const order = await Order.create({ userId: req.user.id, status: 'new', total: 0 });
    for (const it of items) {
        const p = products.find(x => x.id === it.productId);
        const qty = Math.max(1, parseInt(it.quantity || 1));
        const unitPrice = Number(p.price);
        total += unitPrice * qty;
        await OrderItem.create({ orderId: order.id, productId: p.id, quantity: qty, unitPrice });
    }
    await order.update({ total });

    const full = await Order.findByPk(order.id, {
        include: [{ model: Product, through: { attributes: ['quantity', 'unitPrice'] } }]
    });
    res.status(201).json(full);
});

// Get one
router.get('/:id', requireAuth, async (req, res) => {
    const order = await Order.findByPk(req.params.id, {
        include: [{ model: Product, through: { attributes: ['quantity', 'unitPrice'] } }]
    });
    if (!order) return res.status(404).json({ message: 'Not found' });
    if (req.user.role !== 'admin' && order.userId !== req.user.id)
        return res.status(403).json({ message: 'Forbidden' });
    res.json(order);
});

// Update status: admin only
router.put('/:id', requireAuth, allowRoles('admin'), async (req, res) => {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Not found' });
    await order.update({ status: req.body.status ?? order.status });
    res.json(order);
});

// Delete: admin only
router.delete('/:id', requireAuth, allowRoles('admin'), async (req, res) => {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Not found' });
    await order.destroy();
    res.status(204).end();
});

module.exports = router;
