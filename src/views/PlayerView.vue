<template>
    <div>
      <h1>{{ user.name }} {{user.id}}</h1>

      <div id="question">
        <question-section />
      </div>
    </div>

  </template>

    <script>

      import { useUserStore } from '../store/store';
      import questionSection from "../components/questionSection.vue";

      export default {
        components: {
          questionSection,

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

#question {
  flex: 2; /* La section des questions occupe plus d'espace */
  min-width: 700px;
  min-height: 500px;
  padding: 20px;
  background-color: #333; /* Fond sombre */
  border: 4px solid red;
  border-radius: 20px;

  text-align: center;
}
</style>
