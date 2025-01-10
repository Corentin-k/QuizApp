const express = require('express');
const WebSocket = require('ws');
const uuid = require('uuid');
const { query } = require('./db');


const app = express();
const cors = require('cors');

const allowedOrigins = ['http://localhost:5175', 'http://10.3.202.11:5175'];

app.use(cors({
    origin: (origin, callback) => {
        // Vérifie si l'origine de la requête est dans la liste
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Non autorisé par CORS'));
        }
    }, // Front-end URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

console.log('Starting server...');
const httpPort = 8081; // Database port
const wsPort = 8082;   // WebSocket Server port


let connectedClients = [];

const server = app.listen(httpPort, () => {
    console.log(`HTTP Server running on port ${httpPort}`);
});

// WebSocket Server
const wsServer = new WebSocket.Server({ port: wsPort });

wsServer.on('connection', (ws) => {
    console.log('New WebSocket connection');
    connectedClients.push(ws);

    ws.on('message', (message) => {
        console.log('WebSocket message received:', message);
    });

    ws.on('close', () => {
        console.log('WebSocket connection closed');
        connectedClients = connectedClients.filter(client => client !== ws);
    });
});

console.log(`WebSocket Server running on port ${wsPort}`);

// Diffuse the data to all connected clients
const broadcast = (data) => {
    connectedClients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
};

// Routes API REST

// Create a new user
app.post('/users', async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    const userId = uuid.v4();
    const link = `http://localhost:8081/player/${userId}`; // Correction du port ici

    try {
        await query('INSERT INTO users (id, name, link, score) VALUES (?, ?, ?, 0)', [userId, name, link]);

        const newUser = { id: userId, name, link, score: 0 };
        broadcast({ type: 'user_created', user: newUser }); // Diffusion WebSocket
        res.status(201).json(newUser);
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Fetch all users
app.get('/users', async (req, res) => {
    try {
        const users = await query('SELECT * FROM users');
        res.json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Fetch a single user
app.get('/player/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        const rows = await query('SELECT * FROM users WHERE id = ?', [userId]);

        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(rows[0]); // Retourner l'utilisateur
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Delete a user
app.delete('/users/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        const result = await query('DELETE FROM users WHERE id = ?', [userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        broadcast({ type: 'user_deleted', id: userId }); // Diffusion WebSocket
        res.status(200).json({ message: 'User deleted' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Increment user score
app.put('/users/:id/increment', async (req, res) => {
    const userId = req.params.id;
    console.log('Incrementing score for user with ID:', userId);

    try {
        // Incrémenter le score dans la base de données
        const result = await query('UPDATE users SET score = score + 1 WHERE id = ?', [userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Diffuse the  updated user score
        const [updatedUser] = await query('SELECT id, score FROM users WHERE id = ?', [userId]);
        broadcast({ type: 'UPDATE_SCORE', user: updatedUser });

        res.status(200).json({ message: 'Score incremented' });
    } catch (err) {
        console.error("Error incrementing score:", err);
        res.status(500).json({ error: 'Database error' });
    }
});


app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
