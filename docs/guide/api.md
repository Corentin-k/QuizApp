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

### 1. Create a New User

`POST /users`

Create a new user and store it in the database.

#### Request Body

```json
{
  "name": "John Doe"
}
```

#### Response

```json
{
  "id": "uuid",
  "name": "John Doe",
  "link": "http://localhost:8081/player/uuid",
  "score": 0
}
```

#### Example

```bash
curl -X POST http://localhost:8081/users -d '{"name": "John Doe"}' -H "Content-Type: application/json"
```

### 2. Fetch All Users

`GET /users`

Retrieve all users in the database.

#### Response

```json
[
  { "id": "uuid", "name": "John Doe", "link": "http://localhost:8081/player/uuid", "score": 0 }
]
```

#### Example

```bash
curl http://localhost:8081/users
```

### 3. Fetch a Single User

`GET /player/:id`

Retrieve a user by their unique ID.

#### Example

```bash
curl http://localhost:8081/player/uuid
```

#### Response

```json
{
  "id": "uuid",
  "name": "John Doe",
  "link": "http://localhost:8081/player/uuid",
  "score": 0
}
```

### 4. Delete a User

`DELETE /users/:id`

Delete a user by their unique ID.

#### Example

```bash
curl -X DELETE http://localhost:8081/users/uuid
```

#### Response

```json
{
  "message": "User deleted"
}
```

### 5. Increment User Score

`PUT /users/:id/increment`

Increment the score of a user.

#### Example

```bash
curl -X PUT http://localhost:8081/users/uuid/increment
```

#### Response

```json
{
  "message": "Score incremented"
}
```

### Error Handling

If any error occurs during database operations, the API will respond with a status of `500` and an error message.

```json
{
  "error": "Database error"
}
```


