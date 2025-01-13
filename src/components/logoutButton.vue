<script >
export default {
methods: {
  logout() {

    localStorage.removeItem('user');
    this.$router.push({name: 'Login'});
  },

}
}
</script>

<template>
  <button @click="logout()">Logout</button>
</template>

<style scoped>


button {
  position: fixed;
  top: 0;
  right: 0;
  margin: 10px;
  z-index: 9;
}

</style>