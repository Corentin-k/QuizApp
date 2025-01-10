<template>
    <div>
      <h1>{{ user.name }}</h1>
      <p>Score: {{ user.score }}</p>
      <button @click="incrementScore" >+</button>
    </div>

  </template>

    <script>
      import { useUserStore } from '../store';

      export default {
        data() {
          return {
            loading: false,
          };
        },
        computed: {
          user() {
            const userId = this.$route.params.id;
            const userStore = useUserStore();
            return userStore.users.find((u) => u.id === userId);
          },
        },
        created() {
          const userStore = useUserStore();
          userStore.connectWebSocket();
          if (!this.user) {
            userStore.fetchUsers();
          }
        },
        methods: {
          async incrementScore() {

              const userStore = useUserStore();
              await userStore.incrementScore(this.user.id);
          },
        },
      };
    </script>

<style scoped>
h1 {
  font-size: 2em;
}

p {
  font-size: 1.2em;
}

a {
  color: blue;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
