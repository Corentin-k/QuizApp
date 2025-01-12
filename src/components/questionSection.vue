<template>
  <div id="Question">
    <h1>Question</h1>
    <p v-if="user">Score: {{ user.score }}</p>
    <button v-if="user" @click="incrementScore">+</button>
    <p v-else>Admin Mode</p>
  </div>

</template>

<script >
import { useUserStore } from '../store/store';

export default {
  name:"questionSection",
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
}
</script>



<style scoped>

</style>