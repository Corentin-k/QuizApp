---
outline: deep
---

# API Documentation

This page demonstrates the usage of the backend API for managing users and interacting with the WebSocket server.

The API includes HTTP routes for creating, fetching, updating, and deleting users, along with a WebSocket server for real-time communication.

## Server Overview

The server is built with Express and includes a WebSocket server for broadcasting updates. The server listens on two ports:

- **HTTP Server** on port `8081` for REST API endpoints.
- **WebSocket Server** on port `8082` for real-time data broadcasting.

### CORS Configuration

CORS is configured to allow requests from specific origins (e.g., the front-end application running on `localhost:5175`):

```javascript
const allowedOrigins = ['http://localhost:5175', 'http://10.3.202.11:5175'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Non autorisé par CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

## WebSocket Server

The WebSocket server broadcasts real-time updates to connected clients. When users are created, deleted, or their scores are updated, the changes are broadcasted.

### WebSocket Events

- **user_created**: Sent when a new user is created.
- **user_deleted**: Sent when a user is deleted.
- **UPDATE_SCORE**: Sent when a user's score is incremented.

```javascript
ws.on('connection', (ws) => {
    connectedClients.push(ws);
    ws.on('message', (message) => { console.log('WebSocket message received:', message); });
    ws.on('close', () => { connectedClients = connectedClients.filter(client => client !== ws); });
});
```

## Routes API REST
/users
POST
description: Create a new user
parameters:
- name: username
type: string
required: true
- name: password
type: string
required: true
GET
description: Get all users
parameters: []
{id}
GET
description: Get user by id
parameters: []
DELETE
description: Delete user by id
parameters: []
/login
POST
description: Login
parameters:
- name: username
type: string
required: true
- name: password
type: string
required: true

