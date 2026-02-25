const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'devseas_super_secret_key_2026';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.get('/api/products', async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            where: { isActive: true },
            include: { category: true }
        });
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/categories', async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            include: { products: true }
        });
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        // Simple validation
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Name, email, and message are required' });
        }

        const inquiry = await prisma.inquiry.create({
            data: {
                name,
                email,
                phone,
                subject,
                message
            }
        });

        res.status(201).json({ success: true, message: 'Message sent successfully!', data: inquiry });
    } catch (error) {
        console.error('Error submitting inquiry:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        if (!user.isAdmin) {
            return res.status(403).json({ error: 'Access denied. Admins only.' });
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1d' });

        res.json({ success: true, token, user: { id: user.id, email: user.email, name: user.name } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Auth Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).json({ error: 'Unauthorized' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Forbidden' });
        req.user = user;
        next();
    });
};

app.get('/api/inquiries', authenticateToken, async (req, res) => {
    try {
        const inquiries = await prisma.inquiry.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(inquiries);
    } catch (error) {
        console.error('Error fetching inquiries:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/categories', authenticateToken, async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) return res.status(400).json({ error: 'Name is required' });

        const category = await prisma.category.create({
            data: { name, description }
        });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/categories/:id', authenticateToken, async (req, res) => {
    try {
        await prisma.category.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/products', authenticateToken, async (req, res) => {
    try {
        const { name, categoryId, description, price, isActive } = req.body;
        if (!name || !categoryId) return res.status(400).json({ error: 'Name and Category are required' });

        const product = await prisma.product.create({
            data: {
                name,
                description,
                price: price ? parseFloat(price) : null,
                isActive: isActive !== undefined ? isActive : true,
                categoryId: parseInt(categoryId)
            }
        });
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/products/:id', authenticateToken, async (req, res) => {
    try {
        await prisma.product.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Admin Login Route mapping
app.get('/admin/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin-login.html'));
});

// Fallback to index.html for single-page app or static HTML navigation
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
