// src/store.js
import { defineStore } from 'pinia';

export const useUserStore = defineStore('userStore', {
    state: () => ({
        users: [],  // User list
        socket: null,
    }),
    actions: {
        // WebSocket connection
        connectWebSocket() {
            this.socket = new WebSocket('ws://localhost:8082');

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
                }
            };

            this.socket.onclose = () => {
                console.log('WebSocket closed, reconnecting...');
                setTimeout(this.connectWebSocket, 1000); // Reconnect après 1 seconde
            };
        },

        setUsers(users) {
            this.users = users;
        },

        // Fetch the list of users from the server
        async fetchUsers() {
            try {
                const res = await fetch("http://localhost:8081/users");
                const users = await res.json();
                if (Array.isArray(users)) {
                    this.users = users;
                }
            } catch (err) {
                console.error("Error fetching users:", err);
            }
        },

        // Increment the score of a user
        async incrementScore(userId) {
            try {
                const res = await fetch(`http://localhost:8081/users/${userId}/increment`, {
                    method: 'PUT',
                });

                if (!res.ok) {
                    throw new Error('Error incrementing score');
                }

                const updatedUser = await res.json();


            } catch (err) {
                console.error('Error incrementing score:', err);
            }
        }
        ,
        // Delete a user
        async deleteUser(userId) {
            try {
                const res = await fetch(`http://localhost:8081/users/${userId}`, {
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

        async createUser(userName) {
            try {
                const res = await fetch("http://localhost:8081/users", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: userName }),
                });

                if (!res.ok) {
                    throw new Error('Error creating user');
                }

                const user = await res.json();
                this.users.push(user);
            } catch (err) {
                console.error('Error creating user:', err);
            }
        },
    },
});
