<template>
  <div>
    <h1>Quiz Admin</h1>
    <div>
      <h2>Create User</h2>
      <input type="text" v-model="newUserName" placeholder="Enter user name" />
      <button @click="createUser">Create</button>
      <div v-if="createError" style="color: red;">{{ createError }}</div>
      <h2>Users</h2>
      <ul>
        <li v-for="user in users" :key="user.id">
          {{ user.name }} - {{ user.score }}
          <router-link :to="'/player/' + user.id">Link</router-link>
          <button @click="deleteUser(user.id)">Delete</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '../store';

export default {
  data() {
    return {
      newUserName: '',
      createError: null,
    };
  },
  computed: {
    users() {
      const userStore = useUserStore();
      return userStore.users;
    },
  },
  created() {
    const userStore = useUserStore();
    userStore.connectWebSocket();
    userStore.fetchUsers();
  },
  methods: {
    async createUser() {
      const userStore = useUserStore();
      await userStore.createUser(this.newUserName);
      this.newUserName = '';
    },
    async deleteUser(userId) {
      const userStore = useUserStore();
      await userStore.deleteUser(userId);
    },
  },
};
</script>




<style scoped>
body {
  font-family: Arial, sans-serif;
}

h1, h2 {
  color: #333;
}

button {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 8px 0;
}

a {
  color: blue;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
