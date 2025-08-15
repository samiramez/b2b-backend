const router = require('express').Router();
const { Product } = require('../../models');
const { requireAuth, allowRoles } = require('../middleware/auth');

router.get('/', requireAuth, async (_req, res) => {
    res.json(await Product.findAll());
});

router.get('/:id', requireAuth, async (req, res) => {
    const p = await Product.findByPk(req.params.id);
    if (!p) return res.status(404).json({ message: 'Not found' });
    res.json(p);
});

router.post('/', requireAuth, allowRoles('admin', 'supplier'), async (req, res) => {
    const p = await Product.create(req.body);
    res.status(201).json(p);
});

router.put('/:id', requireAuth, allowRoles('admin', 'supplier'), async (req, res) => {
    const p = await Product.findByPk(req.params.id);
    if (!p) return res.status(404).json({ message: 'Not found' });
    await p.update(req.body);
    res.json(p);
});

router.delete('/:id', requireAuth, allowRoles('admin', 'supplier'), async (req, res) => {
    const p = await Product.findByPk(req.params.id);
    if (!p) return res.status(404).json({ message: 'Not found' });
    await p.destroy();
    res.status(204).end();
});

module.exports = router;
