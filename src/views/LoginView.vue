
<template>
<div class="login">
  <h1>Login</h1>
  <form @submit.prevent="handleLogin">
    <div class="form-group">
      <label for="username">Username</label>
      <input v-model="username" id="username" type="text" required />
    </div>
    <div class="form-group">
      <label for="password">Password</label>
      <input v-model="password" id="password" type="password" required />
    </div>
    <button type="submit">Login</button>
  </form>
  <button @click="$router.push({ name: 'SignIn' })">Sign Up</button>

</div>


</template>


<script>
import { useUserStore } from '../store/store';
export default {
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    async handleLogin() {
      try {
        const userStore = useUserStore();
        const user = await userStore.loginUser(this.username, this.password);
        if (user) {
          if(user.role === 'admin'){
            this.$router.push({ name: 'Admin' });
          } else {
          this.$router.push({ name: 'Player', params: { id: user.id } });}
        } else {
          alert('Invalid username or password!');
        }
      } catch (error) {
        console.error(error);
        alert('An error occurred while logging in!');
      }
    },
  },
}

</script>



<style scoped>
.login {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;

}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 4px;
}

input[type="checkbox"] {
  margin-right: 5px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}

.error {
  color: red;
  font-size: 0.875rem;
}
</style>
