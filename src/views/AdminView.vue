<template>
  <logout-button />
  <div class="admin-container">

    <div class="layout">

      <div id="tabUsers">
        <table-users />
      </div>

      <div id="question">
        <question-section />
      </div>
    </div>
  </div>
</template>

<script>
import tableUsers from "../components/tableUsers.vue";
import questionSection from "../components/questionSection.vue";
import LogoutButton from "../components/logoutButton.vue";

export default {
  name: "adminView",
  components: {
    LogoutButton,
    tableUsers,
    questionSection,
  },
};
</script>

<style scoped>


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


.layout {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 20px;
  width: 100%;
}


#tabUsers {
  flex: 1;

  padding: 20px;
  margin-right:100px;
  background-color: #333; /* Fond sombre */
  border: 4px solid red;
  border-radius: 20px;

}


#question {
  flex: 2;
  min-width: 700px;
  min-height: 500px;
  padding: 20px;
  background-color: #333;
  border: 4px solid red;
  border-radius: 20px;

  text-align: center;
}


@media (max-width: 768px) {
  .layout {
    padding-top:50px;
    flex-direction: column;
    align-items: center;
  }

  #tabUsers,
  #question {
    max-width: none;

  }
  #tabUsers{
    margin: 0;
  }
  #question{
    min-width: 500px;
  }

}
@media (max-width: 480px) {
  h1 {
    font-size: 20px; /* Réduction de la taille du texte */
    padding: 15px 0;
  }
  h2{
    font-size:15px;
  }
  .layout{
    width: auto;
    align-items: baseline;
  }

  #tabUsers,
  #question {
    width:auto;

    padding: 10px;
  }

  #question {
    min-width: 100%;

  }
}

</style>
