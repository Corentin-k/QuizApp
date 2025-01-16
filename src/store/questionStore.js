import { defineStore } from "pinia";
import axios from "axios";

export const useQuestionStore = defineStore("questionStore", {
    state: () => ({
        ws: null, // Instance WebSocket
        currentQuestion: null, // Question actuelle
        questions: [], // Liste de toutes les questions
        canAnswer: true, // L'utilisateur peut répondre
        isAdmin: false, // L'utilisateur est administrateur
        sessionActive: false, // Le quiz est actif
    }),
    actions: {
        initWebSocket() {
            this.ws = new WebSocket("ws://localhost:8082");

            this.ws.onmessage = (event) => {
                const message = JSON.parse(event.data);

                // Centraliser la gestion des messages WebSocket
                switch (message.type) {
                    case "question":
                        this.updateQuestion(message.data);
                        break;

                    case "info":
                        alert(message.data);
                        break;
                    case  "stopQuestion":
                        this.canAnswer=false;
                        break;
                    case "UPDATE_SCORE":

                        break;
                    default:
                        console.log("Message non pris en charge :", message);
                }
            };

            this.ws.onclose = () => {
                console.error("Connexion WebSocket fermée");
                setTimeout(() => this.initWebSocket(), 1000);
            };
        },

        startQuiz() {
            if (this.isAdmin) {
                this.sessionActive = true;
                const firstQuestion = this.questions.shift();
                this.currentQuestion = firstQuestion;
                this.ws.send(JSON.stringify({
                    type: "adminCommand",
                    command: "startQuiz",
                    data: firstQuestion,
                }));
            }
        },

        fetchNextQuestion() {
            if (this.questions.length > 0) {
                const nextQuestion = this.questions.shift();
                this.currentQuestion = nextQuestion;
                this.ws.send(JSON.stringify({
                    type: "adminCommand",
                    command: "nextQuestion",
                    data: nextQuestion,
                }));
            }
        },

        stopAnswering() {
            if (this.isAdmin) {
                this.ws.send(JSON.stringify({ type: "adminCommand", command: "stopQuestion" }));
            }
        },

        submitAnswer(answer) {
            if (this.canAnswer && this.currentQuestion) {
                this.ws.send(JSON.stringify({
                    type: "userAnswer",
                    answer,
                }));
                this.toggleAnswering(false);
            }
        },

        updateQuestion(question) {
            this.currentQuestion = question;
            this.canAnswer = true;
        },

        // Vérifier le statut de l'utilisateur et définir son rôle
        fetchUser() {
            const user = JSON.parse(localStorage.getItem("user"));
            if (user && user.role === "admin") {
                this.setAdminStatus(true);
            }
        },


        stopQuiz() {
            if (this.isAdmin) {
                this.sessionActive = false;
                this.currentQuestion = null;
                this.ws.send(JSON.stringify({ type: "adminCommand", command: "stopQuiz" }));
            }
        },

        // Charger toutes les questions
        async fetchQuestions() {
            try {
                const {data} = await axios.get("http://localhost:8081/questions");
                this.questions = data; // Stocker toutes les questions dans l'état
            } catch (error) {
                console.error("Erreur lors de la récupération des questions :", error);
            }
        },



        // Activer ou désactiver la possibilité de répondre
        toggleAnswering(status) {
            this.canAnswer = status;
        },

        // Définir le statut d'administrateur
        setAdminStatus(status) {
            this.isAdmin = status;
        },

        // Définir le statut de la session
        toggleSession(status) {
            this.sessionActive = status;
        },
    },
});
