---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Quiz App"
  text: "The best platform for quiz."
  tagline: "A VitePress Site"
  image:
    src: quizapp.png # Add your hero image here
    alt: "Quiz App Hero Image"
  actions:
    - theme: brand
      text: Get Started
      link: /guide/installation
    - theme: alt
      text: Explore API
      link: /guide/api
    - theme: alt
      text: View on GitHub
      link: https://github.com/Corentin-k/QuizApp

features:
  - icon: 🌿
    title: Pinia Store Management
    details: "Utilized Pinia for efficient state management, ensuring seamless data flow and reactivity across the application."
  - icon: ⚡
    title: Real-Time Updates
    details: "Stay updated with live score tracking, quiz progress, and user activity using WebSocket technology."

  - icon: 🌐
    title: RESTful API
    details: "Access a robust REST API to interact with the backend for user, question, and score management."


  - icon: 📂
    title: JSON-based Questions
    details: "Easily manage and load quiz questions from a JSON file for simplicity and scalability."

---

# Welcome to Quiz App

![Main Page Image](/admin-view.png)


> Explore the [API documentation](/guide/api) or get started with the [configuration guide](/guide/configuration).
