// src/store.js
import { defineStore } from 'pinia';

export const useUserStore = defineStore('userStore', {
    state: () => ({
        users: [],  // User list
        socket: null,
        userResponses: {},
    }),
    actions: {
        // WebSocket connection
        connectWebSocket() {
            this.socket = new WebSocket(`ws://192.168.1.109:${import.meta.env.VITE_PORT_WS}/`);

            // WebSocket event listeners

            this.socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                // Create different actions based on the type of message received
                switch (data.type) {
                    case 'NEW_USER':
                        this.users.push(data.user);
                        break;
                    case 'UPDATE_SCORE':
                        const user = this.users.find(u => u.id === data.user.id);
                        if (user) user.score = data.user.score;
                        break;
                    case 'DELETE_USER':
                        this.users = this.users.filter(u => u.id !== data.id);
                        break;
                    case 'userAnswer':
                        console.log('User answered:', data.userId);
                        break;
                }
                if (data.type === 'userAnswer') {
                    this.userResponses[data.userId] = true;  // Marque l'utilisateur comme ayant répondu
                }
            };

            this.socket.onclose = () => {
                console.log('WebSocket closed, reconnecting...');
                setTimeout(this.connectWebSocket, 1000); // Reconnect après 1 seconde
            };
        },
        allUsersAnswered(totalUsers) {
            return Object.keys(userResponses).length === totalUsers;
        },
        // Fetch the list of users from the server
        async fetchUsers() {
            try {
                const res = await fetch("/users");
                const users = await res.json();
                if (Array.isArray(users)) {
                    this.users = users;
                }
            } catch (err) {
                console.error("Error fetching users:", err);
            }
        },
        // Delete a user
        async deleteUser(userId) {
            try {
                const res = await fetch(`/users/${userId}`, {
                    method: "DELETE",
                });

                if (!res.ok) {
                    throw new Error('Error deleting user');
                }

                this.users = this.users.filter(u => u.id !== userId);
            } catch (err) {
                console.error('Error deleting user:', err);
            }
        },
        async loginUser(userName, password) {
            try {
                const res = await fetch('/users/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: userName, password }),
                });

                if (!res.ok) {
                    throw new Error('Échec de la connexion');
                }

                const user = await res.json();
                this.users.push(user);
                this.saveUserDom(user);
                return user;
            } catch (err) {
                console.error('Erreur lors de la connexion :', err);
                throw err;
            }
        },

        saveUserDom(user) {
            localStorage.setItem('user', JSON.stringify(user));
        },
        async createUser(userName, password) {
            try {
                const res = await fetch("/users", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: userName, password }),
                });

                if (!res.ok) {
                    throw new Error('Error creating user');
                }

                const user = await res.json();
                console.log('User created:', user);
                this.users.push(user);
                this.saveUserDom(user);
                return user;

            } catch (err) {
                console.error('Error creating user:', err);
                return null;
            }
        },
    },
});
