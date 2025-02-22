import { defineStore } from "pinia";
import axios from "axios";
import { Howl } from "howler";
export const useQuestionStore = defineStore("questionStore", {
    state: () => ({
        ws: null, // Instance WebSocket
        currentQuestion: null, // Question actuelle
        questions: [], // Liste de toutes les questions
        canAnswer: true, // L'utilisateur peut répondre
        isAdmin: false, // L'utilisateur est administrateur
        sessionActive: false, // Le quiz est actif
        isCorrectAnswer:false,
        songPlayer: null,
        isPlaying: false,
    }),
    actions: {
        initWebSocket() {
            this.ws = new WebSocket(`ws://192.168.1.142:${import.meta.env.VITE_PORT_WS}`);
            this.ws.onopen = () => {

                const user = JSON.parse(localStorage.getItem('user'));
                this.userId = user?.id;

                if (this.userId) {

                    this.ws.send(JSON.stringify({
                        type: "authenticate",
                        userId: this.userId,
                    }));
                }
            };
            this.ws.onmessage = (event) => {
                const message = JSON.parse(event.data);

                // Centraliser la gestion des messages WebSocket
                switch (message.type) {
                    case "question":
                        this.updateQuestion(message.data);
                        break;
                    case "answered":
                        if (message.data) {
                            console.log("Vous avez déjà répondu.");
                            this.canAnswer = false;
                        } else {
                            this.canAnswer = true;
                        }
                        break;
                    case "start":
                        this.sessionActive = true;
                        break;
                    case "stopQuiz":
                        alert(message.data);
                        this.sessionActive = false;
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
        changeStatus(message){
            this.isCorrectAnswer=message;

        },

        fetchNextQuestion() {
            if (this.questions.length > 0) {
                if (this.songPlayer && this.isPlaying) {
                    this.stopSong();
                }
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
                if (this.songPlayer && this.isPlaying) {
                    this.stopSong();
                }

                this.ws.send(JSON.stringify({ type: "adminCommand", command: "stopQuestion" }));

            }
        },

        submitAnswer(answer,userId) {
            if (this.canAnswer && this.currentQuestion) {
                this.ws.send(JSON.stringify({
                    type: "userAnswer",
                    userId: userId,
                    answer: answer
                }));
                this.canAnswer = false;
            }
        },

        updateQuestion(question) {
            if (this.songPlayer && this.isPlaying) {
                this.stopSong();
            }
            this.currentQuestion = question;
            this.canAnswer = true;
            if (question.type === "song") {
                this.initSongPlayer(question.songUrl);
            }
        },
        initSongPlayer(songUrl) {
            if (this.songPlayer) {
                this.songPlayer.unload();
            }
            this.songPlayer = new Howl({
                src: [songUrl],
                html5: true,
                onend: () => {
                    console.log("La musique est terminée.");
                    this.isPlaying = false;
                },
            });
        },
        playSong() {
            if (this.songPlayer){
                this.stopSong();
                this.songPlayer.play();
                this.isPlaying = true;
            }
        },

        pauseSong() {
            if (this.songPlayer) {
                this.songPlayer.pause();
                this.isPlaying = false;
            }
        },

        stopSong() {
            if (this.songPlayer) {
                this.songPlayer.stop();
                this.isPlaying = false;
            }
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
                const {data} = await axios.get("/questions");
                this.questions = data; // Stocker toutes les questions dans l'état
            } catch (error) {
                console.error("Erreur lors de la récupération des questions :", error);
            }
        },




        toggleAnswering(status) {
            this.canAnswer = status;
        },


        setAdminStatus(status) {
            this.isAdmin = status;
        },


    },
});
