<template>
  <div  id="Question">
    <h1>Quiz</h1>
    <div v-if="sessionActive || isAdmin">
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
          <button @click="submitAnswer(userAnswer.toLowerCase())" :disabled="!canAnswer">
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
      <div v-if="!canAnswer && !isAdmin" class="showAnswer">
        <div v-if="!correctAnswer" >
          <p id="loose">Perdu !</p>
          <p>Correct answer: {{ currentQuestion.correct_answer}}</p>
        </div>
        <p v-else>
          Gagnez !
        </p>

      </div>
    </div>
    <p v-if="!sessionActive">Chargement des questions...</p>




    <!-- Section admin : Changer ou arrêter la question -->


    <div v-if="!canAnswer && isAdmin">
      Correct answer: {{ currentQuestion.correct_answer }}
    </div>
  </div>
  <div v-if="isAdmin">
    <button @click="fetchNextQuestion">Prochaine question</button>
    <button @click="startQuiz" :disabled="sessionActive">Démarrer le quiz</button>
    <button @click="stopAnswering">Arrêter de répondre</button>
    <button @click="stopQuiz">Arrêter le quiz</button>

  </div>
  <div v-if="!sessionActive" >
    <h2>Score</h2>
    <div id="TableScore">
    <table>
      <thead>
      <tr>
        <th>Name</th>
        <th>Score</th>
      </tr>
      </thead>
      <tr v-for="user in useUserStore().users" :key="user.id">
        <td>{{ user.name }}</td>
        <td>{{ user.score }}</td>
      </tr>
    </table>
    </div>
  </div>


</template>

<script>
import { useQuestionStore } from "../store/questionStore";
import axios from "axios";
import {useUserStore} from "../store/store";

export default {
  name: "Quiz",
  data() {
    return {
      userAnswer: "",
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
    correctAnswer(){
      return this.questionStore.isCorrectAnswer;
    },

  },
  methods: {
    useUserStore,

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

      // fetch the user to update the score
      let user=localStorage.getItem('user');
      const id = JSON.parse(user).id;
      this.questionStore.submitAnswer(answer,id);


      if(!this.questionStore.isAdmin && (
        (answer === this.currentQuestion.correct_answer))
      ){
        axios.put(`/users/${id}/increment`);
        console.log("incremented");
        this.questionStore.changeStatus(true)
      }
      else{
        this.questionStore.changeStatus(false)
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

.showAnswer{
  position: inherit;
  margin-top: 50px;
  font-size: 50px;
  color :#3dd68c;
}

#TableScore{
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
#TableScore th{
  color: #3dd68c;
  font-size: 20px;
}
#TableScore thead{
  width: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
}


#loose{
  color:red;

}
</style>
