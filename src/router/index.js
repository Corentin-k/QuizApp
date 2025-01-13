import { createRouter, createWebHistory } from 'vue-router';
import AdminPage from '../views/AdminView.vue';
import PlayerView from '../views/PlayerView.vue';
import Signin from '../views/SignInView.vue';
import Login from '../views/LoginView.vue';
import NotFound from '../views/NotFoundView.vue';
const routes = [
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
    {
        path: '/',
        name: 'Login',
        component: Login
    },
    {
        path: '/admin',
        name: 'Admin',
        component: AdminPage,
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
        path: '/signin',
        name: 'SignIn',
        component: Signin
    },
    {
        path: '/player/:id',
        name: 'Player',
        component: PlayerView,
        props: true,
        meta: { requiresAuth: true },
    },



];

const router = createRouter({
    history: createWebHistory(),
    routes,
});
router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('user');
    const user = isAuthenticated ? JSON.parse(localStorage.getItem('user')) : null;

    if (to.meta.requiresAuth && !isAuthenticated) {
        // Rediriger vers la page de login si l'utilisateur n'est pas authentifié
        next({ name: 'Login' });
    } else if (to.meta.requiresAdmin && (!user || user.role !== 'admin')) {
        // Rediriger vers la page de connexion si l'utilisateur n'a pas le rôle admin
        alert('Access Denied: Admins only.');
        next({ name: 'Login' });
    } else {
        next();
    }
});
export default router;
