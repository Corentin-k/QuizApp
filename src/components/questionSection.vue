<template>
  <div  id="Question">


    <h1 v-if="currentQuestion" :style="{ color: categoryColor }">Question</h1>
    <h1 v-else >Question</h1>

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
          <input
              type="text"
              v-model="userAnswer"
              placeholder="Votre réponse ici"
              :disabled="!canAnswer"
          />
          <br/>
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
    <div v-if="currentQuestion && currentQuestion.type === 'song'">
      <button @click="playSong" :disabled="isPlaying">Jouer la musique</button>
      <button @click="pauseSong" :disabled="!isPlaying" >Pause</button>
      <button @click="stopSong">Arrêter</button>
    </div>


    <div id="barre"></div>
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
    isPlaying(){
      return this.questionStore.isPlaying;
    },
    categoryColor() {
      // Mappe les catégories aux couleurs
      const categoryColors = {
        geo: "blue",
        music: "purple",
        histoire: "brown",
        science: "green",
        politique: "red",
        cinéma: "yellow",
        sport:"orange",
      };
      return categoryColors[this.currentQuestion.category] || "black";

    }
  },
  methods: {
    useUserStore,

    playSong() {
      this.questionStore.playSong();
    },
    pauseSong() {
      this.questionStore.pauseSong();
    },
    stopSong() {
      this.questionStore.stopSong();
    },


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
beforeDestroy() {
  if (this.currentSong) {
    this.currentSong.unload(); // Libère les ressources utilisées par Howler
  }
},
};
</script>

<style scoped>
input, button {
  margin: 10px;
  width: 250px;
  height: 50px;
  text-align: center;
  border-radius: 8px;
  transition: all 0.3s ease;
}

button:hover:not(:disabled) {
  background-color: #116bc6;
  transform: scale(1.1);
}

button:disabled {
  background-color: #93aadc;
  color: #666666;
  cursor: not-allowed;
  opacity: 0.7;
}

.showAnswer {
  position: inherit;
  margin-top: 50px;
  font-size: 50px;
  color: #3dd68c;
  animation: fadeIn 1s ease-out;
}

#TableScore {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

#TableScore th {
  color: #3dd68c;
  font-size: 20px;
}

#TableScore td {
  padding: 10px;
}



#loose {
  color: red;

}

#barre {
  width: 100%;
  border: 1px solid #2581d2;
  margin: 20px 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}



</style>
