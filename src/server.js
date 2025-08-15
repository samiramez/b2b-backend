require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const { sequelize } = require('../models');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

const app = express();
app.use(helmet());            // required
app.use(express.json());      // required
app.use(compression());       // required
app.use(morgan('dev'));       // required

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

const port = process.env.PORT || 4000;
sequelize.authenticate().then(() => {
    app.listen(port, () => console.log(`API listening on ${port}`));
});
