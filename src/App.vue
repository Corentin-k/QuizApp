<template>
  <div id="app">
    <h1>Quiz App</h1>
    <router-view />
  </div>
</template>

<script>


export default {
  name: "App",

};
</script>

<style scoped>
#app {
  text-align: center;
  font-family: Arial, sans-serif;
}
h1 {
  position: fixed;
  top:0;
  left: 50%;
  translate: -50%;
  background-color: #242424;
  width: 100%;
  margin-top: 0;
  padding: 10px;
}
</style>
