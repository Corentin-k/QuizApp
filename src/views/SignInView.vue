<template>
  <div class="signin">
    <h1>Sign In</h1>
    <form @submit.prevent="handleSignIn">
      <div class="form-group">
        <label for="username">Username</label>
        <input v-model="username" id="username" type="text" required />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input v-model="password" id="password" type="password" required />
      </div>
      <div class="form-group">
        <label for="confirmPassword">Confirm Password</label>
        <input v-model="confirmPassword" id="confirmPassword" type="password" required />
        <p v-if="passwordMismatch" class="error">Passwords do not match!</p>
      </div>
      <div class="form-group">
        <label for="rememberMe">Remember Me</label>
        <input v-model="rememberMe" type="checkbox" id="rememberMe" />
      </div>
      <button type="submit" :disabled="passwordMismatch">Sign In</button>
    </form>
  </div>
</template>

<script>
import { useUserStore } from '../store/store';

export default {
  data() {
    return {
      username: "",
      password: "",
      confirmPassword: "",
      rememberMe: false,
    };
  },
  computed: {
    passwordMismatch() {
      return this.password !== this.confirmPassword;
    },
  },
  methods: {

      async handleSignIn() {
        if (this.passwordMismatch) {
          alert('Missing fields or passwords do not match!');
          return;
        }

        try {
          const userStore = useUserStore();
          const user = await userStore.createUser(this.username, this.password);

          if (user) {
            alert('User created successfully!');
            this.$router.push({ name: 'Player', params: { id: user.id } });
          } else {
            console.log(user)
            alert('User name already exists!');
          }
        } catch (error) {
          console.error('Error creating user:', error);
        }
      },
    },


};
</script>

<style scoped>
.signin {
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
