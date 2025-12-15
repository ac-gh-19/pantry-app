const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// middlware function parse response body into js object
app.use(express.json());

// routes
app.get('/api/test', (req, res) => {
    res.json({message: 'backend is working'})
})

app.get('/api/pantry', (req, res) => {
    res.json({message: 'pantry items'})
})

app.post('/api/pantry', (req, res) => {
    res.json({message: 'add pantry item', data: req.body})
})

app.put('/api/pantry/:id', (req, res) => {
    res.json({message: `updating pantry item: ${req.params.id}`})
})

app.delete('/api/pantry/:id', (req, res) => {
    res.json({message: `deleting pantry item: ${req.params.id}`})
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
