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


This documentation describes the different routes of the API used in the quiz system.

## /users

### POST /users {#post-users}
Create a new user.

#### Parameters
- `username` (string): The username (required).
- `password` (string): The password (required).

#### Responses
- **201**: User created successfully.
- **400**: Missing values.
- **409**: User already exists.

### GET /users {#get-users}
Retrieve all users (admin-only access).

#### Parameters
- `page` (integer): The page number (optional).
- `limit` (integer): The number of items to return per page (optional).

#### Response
- **200**: List of users.

### GET /users/{id} {#get-users-id}
Retrieve user details by their ID.

#### Responses
- **200**: User details.
- **404**: User not found.

### DELETE /users/{id} {#delete-users-id}
Delete a user by their ID.

#### Responses
- **204**: User deleted successfully.
- **403**: Unauthorized access.

### POST /users/login {#post-users-login}
Authenticate the user and return a token.

#### Parameters
- `username` (string): The username (required).
- `password` (string): The password (required).

#### Responses
- **200**: Login successful, returns a token.
- **401**: Invalid credentials.

---

## /questions

### GET /questions {#get-questions}
Retrieve all questions.

#### Parameters
- `page` (integer): The page number (optional).
- `limit` (integer): The number of questions to return (optional).

### GET /questions/{id} {#get-questions-id}
Retrieve a question by its ID.

#### Response
- **200**: Question details.

### GET /questions/category/{category} {#get-questions-category}
Retrieve questions by category.

#### Parameters
- `category` (string): The category of the question (required).

#### Response
- **200**: List of questions matching the category.

---

## /leaderboard

### GET /leaderboard {#get-leaderboard}
Retrieve the leaderboard.

#### Parameters
- `limit` (integer): The number of items to return (optional).
- `category` (string): The category of questions to filter the leaderboard (optional).

#### Response
- **200**: Leaderboard details.
