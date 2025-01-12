<template>
  <div class="admin-container">
    <h1>Quiz Admin</h1>
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

export default {
  name: "adminView",
  components: {
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
  margin-top: 0px;
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

/* Style de la section des questions */
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


@media (max-width: 768px) {
  .layout {
    padding-top:50px;
    flex-direction: column;
    align-items: center;
  }

  #tabUsers,
  #question {
    max-width: none;
    min-width: auto;
  }
  #tabUsers{
    margin: 0;
  }

}
</style>
