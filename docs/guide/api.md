---
    outline: deep
---

# API Documentation

This documentation outlines the REST API and WebSocket functionality for the quiz application. The backend is built using **Node.js**, **Express**, and **WebSocket**, enabling real-time communication and user interaction.

## Server Overview

The server is built with Express and includes a WebSocket server for broadcasting updates. It listens on the following ports:

- **HTTP Server**: Port `8081` for REST API endpoints.
- **WebSocket Server**: Port `8082` for real-time communication.

---

## WebSocket Server

The WebSocket server facilitates real-time updates for connected clients. It broadcasts changes such as user creation, deletion, or score updates.

### WebSocket Events

- **user_created**: Triggered when a new user is created.
- **user_deleted**: Triggered when a user is deleted.
- **UPDATE_SCORE**: Triggered when a user's score is updated.

#### Example WebSocket Handler
```javascript
ws.on('connection', (ws) => {
    connectedClients.push(ws);

    ws.on('message', (message) => {
        console.log('WebSocket message received:', message);
    });

    ws.on('close', () => {
        connectedClients = connectedClients.filter(client => client !== ws);
    });
});
```

---

## REST API Routes

Below is the list of REST API endpoints provided by the server.

### **/users**

#### POST `/users` {#post-users}
Create a new user.

**Parameters:**
- `username` (string, required): The user's username.
- `password` (string, required): The user's password.

**Responses:**
- **201**: User created successfully.
- **400**: Missing required parameters.
- **409**: User already exists.

---

#### GET `/users` {#get-users}
Retrieve a list of all users (admin-only access).

**Query Parameters (optional):**
- `page` (integer): The page number.
- `limit` (integer): The number of items per page.

**Responses:**
- **200**: List of users.

---

#### GET `/users/{id}` {#get-users-id}
Retrieve details of a user by their ID.

**Responses:**
- **200**: User details.
- **404**: User not found.

---

#### DELETE `/users/{id}` {#delete-users-id}
Delete a user by their ID.

**Responses:**
- **204**: User deleted successfully.
- **403**: Unauthorized access.

---

#### POST `/users/login` {#post-users-login}
Authenticate the user and return a token.

**Parameters:**
- `username` (string, required): The username.
- `password` (string, required): The password.

**Responses:**
- **200**: Login successful (returns a token).
- **401**: Invalid credentials.

---

### **/questions**

#### GET `/questions` {#get-questions}
Retrieve all questions.

**Query Parameters (optional):**
- `page` (integer): The page number.
- `limit` (integer): The number of questions to return.

**Responses:**
- **200**: List of questions.

---

#### GET `/questions/{id}` {#get-questions-id}
Retrieve a specific question by its ID.

**Responses:**
- **200**: Question details.
- **404**: Question not found.

---

#### GET `/questions/category/{category}` {#get-questions-category}
Retrieve questions by category.

**Parameters:**
- `category` (string, required): The category of the questions.

**Responses:**
- **200**: List of questions in the specified category.
- **404**: No questions found in the category.

---










