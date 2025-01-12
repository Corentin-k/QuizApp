<template>
  <div id="Question">
    <h1>Question</h1>
    <p v-if="user">Score: {{ user.score }}</p>
    <button v-if="user" @click="incrementScore">+</button>
    <p v-else>Admin Mode</p>
    <div v-if="song"></div>
    <div v-if="multipleChoice">


    </div>
    <div v-else>
      <h2> <label for="question">Quelle est la capitale du Canada ?</label></h2>

      <input type="text" id="name" name="name" required autocapitalize="off" placeholder="Answer"  />
      <br>
      <button id="choice">Ottawa</button>
      <button id="choice">Vancouver</button>
      <br>
      <button id="choice">Toronto</button>
      <button id="choice">Montreal</button>
    </div>

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
input, button{
  margin:10px ;
  width: 250px;
  height: 50px;
  text-align: center;
}
</style>