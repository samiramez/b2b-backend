require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const cors = require('cors'); // Add this line
const { sequelize } = require('../models');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

const app = express();

// Security and middleware
app.use(helmet());
app.use(express.json());
app.use(compression());
app.use(morgan('dev'));

// CORS Configuration - Add this section
app.use(cors({
    origin: 'http://localhost:8100', // Your Angular app's origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // If you're using cookies/sessions
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

const port = process.env.PORT || 4000;
sequelize.authenticate().then(() => {
    app.listen(port, () => console.log(`API listening on ${port}`));
});