const express = require('express');
const WebSocket = require('ws');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { query } = require('./db');
const fs = require('fs');

require('dotenv').config()

const app = express();


const dbPort = process.env.PORT_DB; // Database port
const wsPort = process.env.PORT_WS;   // WebSocket Server port
const frontPort = process.env.PORT_FRONTEND

const cors = require('cors');
const allowedOrigins = [`http://localhost:${frontPort}`, `https://10.3.202.11:${frontPort}`,`http://localhost:5176`];

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



let connectedClients = [];
let currentQuestion = null;


const server = app.listen(dbPort, () => {
    console.log(`HTTP Server running on port ${dbPort}`);
});

////////////////////////////////////////////////////////////////////////
// WebSocket Server
const wsServer = new WebSocket.Server({ port: wsPort });
wsServer.on("connection", (ws) => {
    console.log("Nouvelle connexion WebSocket");
    connectedClients.push(ws);

    // Envoyer l'état actuel au client
    if (currentQuestion) {
        ws.send(JSON.stringify({ type: "question", data: currentQuestion }));
    }

    ws.on("message", (message) => {
        const parsedMessage = JSON.parse(message);


        if (parsedMessage.type === "adminCommand") {
            switch (parsedMessage.command) {
                case "startQuiz":
                    currentQuestion = parsedMessage.data || null;
                    broadcast({ type: "question", data: currentQuestion });
                    break;

                case "nextQuestion":
                    currentQuestion = parsedMessage.data;
                    broadcast({ type: "question", data: currentQuestion });
                    break;

                case "stopQuiz":
                    currentQuestion = null;
                    broadcast({ type: "info", data: "Le quiz est terminé." });
                    break;
                case "stopQuestion":
                    broadcast({ type: "stopQuestion" });
                    break;
                default:
                    console.log("Commande non reconnue :", parsedMessage.command);
            }
        }

        // Traitement des réponses utilisateur
        else if (parsedMessage.type === "userAnswer") {
            console.log("Réponse reçue :", parsedMessage.answer);
        }
    });

    ws.on("close", () => {
        console.log("Connexion WebSocket fermée");
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

////////////////////////////////////////////////////////////////////////
// Routes API REST

// Create a new user
app.post('/users', async (req, res) => {
    const { name, password} = req.body;
    if (!name || !password) {
        return res.status(400).json({ error: 'Missing values' });
    }
    // Verify if the user already exists
    const [existingUser] = await query('SELECT * FROM users WHERE name = ?', [name]);
    if (existingUser) {
        return res.status(409).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    const link = `http://localhost:${dbPort}/player/${userId}`;

    try {
        await query('INSERT INTO users (id, name, password, link) VALUES (?,?, ?, ?)',
            [userId, name,hashedPassword, link]);

        const newUser = { id: userId, name, link };
        broadcast({ type: 'user_created', user: newUser }); // Diffusion WebSocket
        res.status(201).json({ message: 'User created successfully.', user: newUser });
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Fetch all users
app.get('/users', async (req, res) => {
    try {
        const users = await query('SELECT * FROM users WHERE role="player"');
        res.json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/users/login', async (req, res) => {
    const { name, password } = req.body;

    if (!name || !password) {
        return res.status(400).json({ error: 'Nom et mot de passe requis.' });
    }

    try {
        const [user] = await query('SELECT * FROM users WHERE name = ?', [name]);
        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé.' });
        }

        // Vérification du mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Mot de passe incorrect.' });
        }

        res.status(200).json({ id: user.id, name: user.name,role:user.role, link: user.link });
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
});




// Fetch a single user
app.get('/users/:id', async (req, res) => {
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

////////////////////////////////////////////////////////////////////////
// Questions API
const loadQuestions = () => {
    const data = fs.readFileSync('./backend/questions.json', 'utf-8');
    return JSON.parse(data).questions;
};
const questions = loadQuestions();

app.get('/questions', (req, res) => {

    res.json(questions);
});

// Endpoint pour récupérer une question par ID
app.get('/questions/:id', (req, res) => {

    const question = questions.find(q => q.id === parseInt(req.params.id));
    if (!question) {
        return res.status(404).json({ error: 'Question non trouvée' });
    }
    res.json(question);
});

app.get('/questions/categorie/:categorie', (req, res) => {
    const category = req.params.categorie; // Récupérer la catégorie de l'URL
    const question = questions.filter(q => q.category.toLowerCase() === category.toLowerCase());
    if (question.length === 0) {


        return res.status(404).json({ error: 'Question non trouvée' });
    }
    res.json(question);

});

//////////////////////////////////////////////////////////////////////////////////////////

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
