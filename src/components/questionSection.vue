<template>
  <div id="Question">
    <h1>Quiz</h1>

    <!-- Section principale des questions -->
    <div v-if="currentQuestion">
      <h2>{{ currentQuestion.question }}</h2>

      <div v-if="currentQuestion.type === 'qcm'">
        <button
            v-for="(choice, index) in currentQuestion.answers"
            :key="index"
            :disabled="!canAnswer"
            @click="submitAnswer(choice)"
        >
          {{ choice }}
        </button>
      </div>

      <div v-else-if="currentQuestion.type === 'question'">
        <input
            type="text"
            v-model="userAnswer"
            placeholder="Votre réponse ici"
            :disabled="!canAnswer"
        />
        <button @click="submitAnswer(userAnswer)" :disabled="!canAnswer">
          Soumettre
        </button>
      </div>

      <div v-else-if="currentQuestion.type === 'song'">
        <audio :src="currentQuestion.audioUrl" controls></audio>
        <input
            type="text"
            v-model="userAnswer"
            placeholder="Votre réponse ici"
            :disabled="!canAnswer"
        />
        <button @click="submitAnswer(userAnswer)" :disabled="!canAnswer">
          Soumettre
        </button>
      </div>
    </div>

    <p v-else>Chargement des questions...</p>

    <!-- Section admin : Changer ou arrêter la question -->
    <div v-if="isAdmin">
      <button @click="fetchNextQuestion">Prochaine question</button>
      <button @click="startQuiz" :disabled="sessionActive">Démarrer le quiz</button>
      <button @click="stopAnswering">Arrêter de répondre</button>
      <button @click="stopQuiz">Arrêter le quiz</button>
    </div>
  </div>
</template>

<script>
import { useQuestionStore } from "../store/questionStore";
import axios from "axios";

export default {
  name: "Quiz",
  data() {
    return {
      userAnswer: "", // Réponse de l'utilisateur
    };
  },
  computed: {
    currentQuestion() {
      return this.questionStore.currentQuestion;
    },
    canAnswer() {
      return this.questionStore.canAnswer;
    },
    isAdmin() {
      return this.questionStore.isAdmin;
    },
    sessionActive() {
      return this.questionStore.sessionActive;
    },
  },
  methods: {

    async initQuiz() {
      await this.questionStore.fetchUser();
      this.questionStore.initWebSocket();
      if (this.isAdmin) {
        await this.questionStore.fetchQuestions();
      }
    },
    // Démarrer le quiz
    startQuiz() {
      this.questionStore.startQuiz();
    },
    // Obtenir la prochaine question
    fetchNextQuestion() {
      this.questionStore.fetchNextQuestion();
    },
    // Soumettre une réponse
    submitAnswer(answer) {
      this.questionStore.submitAnswer(answer);
      // fetch the user to update the score
      let user=localStorage.getItem('user');
      const id = JSON.parse(user).id;



      if(!this.questionStore.isAdmin && (
          (answer === this.currentQuestion.answers[this.currentQuestion.correct_answer ]&&this.currentQuestion.type === 'qcm')
          || (answer === this.currentQuestion.correct_answer))
      ){
        axios.put(`http://localhost:8081/users/${id}/increment`);
        console.log("incremented");
      }
      this.userAnswer = "";
    },

    stopAnswering() {
      this.questionStore.stopAnswering();
    },
    stopQuiz() {
      this.questionStore.stopQuiz();
    },
  },
  created() {
    this.questionStore = useQuestionStore();
    this.initQuiz();
  },
};
</script>

<style scoped>
input,
button {
  margin: 10px;
  width: 250px;
  height: 50px;
  text-align: center;
}
</style>
