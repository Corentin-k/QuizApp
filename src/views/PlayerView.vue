<template >
    <logout-button  />

  <h1>{{ user.name.toUpperCase() }}</h1>

  <div id="question" :style="{ borderColor: categoryBorderColor }">
      <div >
        <question-section />
      </div>

    </div>

  </template>

    <script>

      import { useUserStore } from '../store/store';
      import questionSection from "../components/questionSection.vue";
      import LogoutButton from "../components/logoutButton.vue";
      export default {
        components: {
          LogoutButton,
          questionSection,
        },
        computed: {
          user() {
            const userId = this.$route.params.id;
            const userStore = useUserStore();
            return userStore.users.find((u) => u.id === userId);
          }
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
  flex: 2;
  min-width: 600px;
  max-width: 800px;
  min-height: 500px;
  padding: 20px;
  background-color: #333;
  border: 4px solid red;
  border-radius: 20px;
  margin-top: 50px;

  text-align: center;
}
</style>
