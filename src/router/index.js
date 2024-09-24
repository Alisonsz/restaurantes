import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store'; // Importando o store para acessar o token
import HomeView from '../views/HomeView.vue';
import PrivacyPolicy from '@/views/PrivacyPolicy.vue';
import AccountConfig from '@/views/AccountConfig.vue';
import Help from '@/views/Help.vue';
import PrivacyUser from '@/views/PrivacyUser.vue';

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView,
    },
    {
        path: '/cadastro',
        name: 'register',
        component: () => import('../views/RegisterView.vue')
    },
    {
        path: '/perfil',
        name: 'profile',
        component: () => import('../views/ProfileView.vue')
    },
    {
        path: '/cardapio',
        name: 'menu',
        component: () => import('../views/MenuView.vue')
    },
    {
        path: '/horario',
        name: 'hours',
        component: () => import('../views/HoursView.vue')
    },
    {
        path: '/preparo',
        name: 'preparation',
        component: () => import('../views/PreparationView.vue')
    },
    {
        path: '/configuracoes',
        name: 'config',
        component: () => import('../views/ConfigView.vue')
    },
    {
        path: '/performance',
        name: 'performance',
        component: () => import('../views/PerformanceView.vue')
    },
    {
        path: '/visao',
        name: 'overview',
        component: () => import('../views/OverviewView.vue')
    },
    {
        path: '/operacional',
        name: 'operational',
        component: () => import('../views/OperationalView.vue')
    },
    {
        path: '/vendas',
        name: 'sales',
        component: () => import('../views/SalesView.vue')
    },
    {
        path: '/clientes',
        name: 'customers',
        component: () => import('../views/CustomersView.vue')
    },
    {
        path: '/historico',
        name: 'history',
        component: () => import('../views/HistoryView.vue')
    },
    {
        path: '/pagamentos',
        name: 'payments',
        component: () => import('../views/PaymentsView.vue')
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/LoginView.vue')
    },
    {
        path: '/politica-de-privacidade',
        name: 'PrivacyPolicy',
        component: PrivacyPolicy,
    },
    {
        path: '/ajuda',
        name: 'help',
        component: Help,
    },
    {
        path: '/configuracoes-da-conta',
        name: 'AccountConfig',
        component: AccountConfig,
    },
    {
        path: '/privacidade-dos-usuarios',
        name: 'PrivacyUser',
        component: PrivacyUser,
    },
    {
        path: '/gestao-de-pedidos',
        name: 'orders',
        component: () => import('../views/Orders.vue')
    },
    {
        path: '/chamados',
        name: 'Chat',
        component: () => import('../views/Chat.vue')
    },
    {
        path: '/promocoes',
        name: 'promotions',
        component: () => import('../views/Promotions.vue')
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

// Guard de navegação para verificar autenticação
router.beforeEach((to, from, next) => {
    const publicPages = ['/login', '/']; // Define as rotas públicas que não precisam de autenticação
    const authRequired = !publicPages.includes(to.path); // Checa se a rota atual precisa de autenticação
    const token = store.state.token; // Obtém o token do Vuex store

    // Se a rota precisar de autenticação e o token não existir, redireciona para /login
    if (authRequired && !token) {
        return next('/login'); // Redireciona para a rota de login se não houver token
    }

    try {
        // Verifica se `navbarData` existe no Vuex ou qualquer outra lógica necessária
        if (!store.state.navbarData && authRequired) {
            throw new Error('Navbar data not found'); // Lança erro se navbarData não existir
        }

        // Se tudo estiver OK, segue para a rota desejada
        next();
    } catch (error) {
        console.error('Error in navigation guard:', error);
        next('/login'); // Redireciona para a página de login em caso de erro
    }
});

export default router;
