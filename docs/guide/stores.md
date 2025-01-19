# Pinia Stores Guide

## Question Store

The **Question Store** (`questionStore`) manages the quiz flow, questions, WebSocket communication, and user interactions.

### State Properties
- `ws`: Instance of the WebSocket connection.
- `currentQuestion`: The current question being displayed.
- `questions`: List of all quiz questions.
- `canAnswer`: Boolean indicating whether the user can answer the current question.
- `isAdmin`: Boolean to determine if the user has admin privileges.
- `sessionActive`: Indicates whether the quiz session is active.
- `isCorrectAnswer`: Indicates whether the last answer submitted was correct.
- `songPlayer`: Instance of Howler.js to handle audio playback for song-based questions.
- `isPlaying`: Boolean to indicate whether a song is currently playing.

### Actions
#### WebSocket Management
- **`initWebSocket()`**: Initializes the WebSocket connection and handles incoming messages (`question`, `answered`, `start`, `stopQuiz`, etc.).
- **`submitAnswer(answer, userId)`**: Sends the user's answer to the server via WebSocket.
- **`stopQuiz()`**: Ends the quiz session (admin-only action).

#### Quiz Flow
- **`startQuiz()`**: Starts the quiz by sending the first question (admin-only action).
- **`fetchNextQuestion()`**: Moves to the next question in the quiz (admin-only action).
- **`stopAnswering()`**: Prevents users from answering the current question (admin-only action).
- **`updateQuestion(question)`**: Updates the current question displayed to users.

#### Audio Management
- **`initSongPlayer(songUrl)`**: Initializes the audio player for song-based questions.
- **`playSong()`**, **`pauseSong()`**, **`stopSong()`**: Controls playback of the song.

#### Utility
- **`fetchQuestions()`**: Retrieves the list of quiz questions from the server.
- **`toggleAnswering(status)`**: Allows or restricts answering based on the status.
- **`setAdminStatus(status)`**: Sets the admin status of the current user.

---

## User Store

The **User Store** (`userStore`) handles user management, user responses, and WebSocket communication related to users.

### State Properties
- `users`: List of all registered users.
- `socket`: Instance of the WebSocket connection for user-related messages.
- `userResponses`: Tracks which users have answered the current question.

### Actions
#### WebSocket Management
- **`connectWebSocket()`**: Establishes a WebSocket connection and listens for user-related events (`NEW_USER`, `UPDATE_SCORE`, `DELETE_USER`, `userAnswer`).
- **`allUsersAnswered(totalUsers)`**: Checks if all users have submitted their answers.

#### User Management
- **`fetchUsers()`**: Retrieves the list of users from the server.
- **`deleteUser(userId)`**: Deletes a user from the server and updates the local user list.
- **`createUser(userName, password)`**: Creates a new user and stores it locally.
- **`loginUser(userName, password)`**: Logs in an existing user and saves their details locally.

#### Utility
- **`saveUserDom(user)`**: Saves the current user's details in localStorage for persistence.

---

## Interaction Between Stores

1. **Question Store**:
    - Manages the quiz flow and sends quiz-related commands to the server (e.g., starting/stopping the quiz, updating questions).
    - Receives real-time updates about quiz progress from the WebSocket server.

2. **User Store**:
    - Tracks the list of users and their responses.
    - Updates user scores and manages user-related WebSocket events.

---

## Key Features
- **Real-Time Communication**: Both stores use WebSocket connections for real-time updates between the client and server.
- **Admin and User Roles**: The `isAdmin` property in the Question Store ensures that certain actions are restricted to administrators.
- **Extensibility**: The modular nature of these stores allows easy addition of new features, such as additional question types or user roles.

---

### Notes
- The `Howler.js` integration in the Question Store adds an engaging audio feature for quiz questions involving music.
- The `userResponses` in the User Store simplifies the tracking of user activity during the quiz.

This structure ensures the separation of concerns, making the application easy to maintain and scale.
