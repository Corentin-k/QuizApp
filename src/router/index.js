import { createRouter, createWebHistory } from 'vue-router';
import AdminPage from '../views/AdminView.vue';
import PlayerView from '../views/PlayerView.vue';
import signin from '../views/SignInView.vue';

const routes = [
    {
        path: '/',
        name: 'Admin',
        component: AdminPage,
    },
    {
        path: '/signin',
        name: 'SignIn',
        component: signin
    },
    {
        path: '/player/:id',
        name: 'Player',
        component: PlayerView,
        props: true,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
