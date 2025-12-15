const express = require('express');
const pool = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// middlware function parse response body into js object
app.use(express.json());

// routes
app.get('/api/test', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({
            message: 'Backend / database connected',
            timestamp: result.rows[0].now
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Database connection failed'});
    }
})

app.get('/api/pantry', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM pantry_items');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Failed to fetch items'});
    }
})

app.post('/api/pantry', async (req, res) => {
    try {
        const { name, quantity, unit } = req.body;
        const result = await pool.query(
            'INSERT INTO pantry_items (name, quantity, unit) VALUES ($1, $2, $3) RETURNING *',
            [name, quantity, unit]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
})

app.put('/api/pantry/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, quantity, unit } = req.body;
        const result = await pool.query(
            'UPDATE pantry_items SET name = $1, quantity = $2, unit = $3 WHERE id = $4 RETURNING *',
            [name, quantity, unit, id]
        )
        if (result.rows.length === 0) {
            return res.status(404).json({error: 'Item not found'});
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({error: err});
    }
})

app.delete('/api/pantry/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'DELETE FROM pantry_items WHERE id = $1 RETURNING *',
            [id]
        )
        if (result.rows.length === 0) {
            return res.status(404).json({error: 'Item not found'});
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({error: err});
    }
})

app.post('/api/signup', (req, res) => {
    res.json({message: 'signup endpoint'})
})

app.post('/api/login', (req, res) => {
    res.json({message: 'login endpoint'})
})

app.post('/api/recipes/generate', (req, res) => {
    res.json({message: 'generate recipes'})
})

app.get('/api/recipes', (req, res) => {
    res.json({message: 'get recipes'})
})

app.post('/api/recipes', (req, res) => {
    res.json({message: 'add recipes'})
})


app.listen(PORT, (err) => {
    if (err) {
        console.log(`Error starting server: ${err}`)
    } else {
        console.log('Server successfully started');
    }
})
