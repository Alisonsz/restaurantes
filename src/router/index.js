import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LocationPicker from '../LocationPicker.vue';
import PrivacyPolicy from '@/views/PrivacyPolicy.vue';
import AccountConfig from '@/views/AccountConfig.vue';
import Help from '@/views/Help.vue';
import PrivacyUser from '@/views/PrivacyUser.vue';
const routes = [
    {
        path: '/',
        name: 'home',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: HomeView
    },
    {
        path: '/cadastro',
        name: 'register',
        component: () => import(/* webpackChunkName: "about" */ '../views/RegisterView.vue')
    },
    {
        path: '/perfil',
        name: 'profile',
        component: () => import(/* webpackChunkName: "about" */ '../views/ProfileView.vue')
    },
    {
        path: '/cardapio',
        name: 'menu',
        component: () => import(/* webpackChunkName: "about" */ '../views/MenuView.vue')
    },
    {
        path: '/horario',
        name: 'hours',
        component: () => import(/* webpackChunkName: "about" */ '../views/HoursView.vue')
    },
    {
        path: '/preparo',
        name: 'preparation',
        component: () => import(/* webpackChunkName: "about" */ '../views/PreparationView.vue')
    },
    {
        path: '/configuracoes',
        name: 'config',
        component: () => import(/* webpackChunkName: "about" */ '../views/ConfigView.vue')
    },
    {
        path: '/performance',
        name: 'performance',
        component: () => import(/* webpackChunkName: "about" */ '../views/PerformanceView.vue')
    },
    {
        path: '/visao',
        name: 'overview',
        component: () => import(/* webpackChunkName: "about" */ '../views/OverviewView.vue')
    },
    {
        path: '/operacional',
        name: 'operacional',
        component: () => import(/* webpackChunkName: "about" */ '../views/OperationalView.vue')
    },
    {
        path: '/vendas',
        name: 'sales',
        component: () => import(/* webpackChunkName: "about" */ '../views/SalesView.vue')
    },
    {
        path: '/clientes',
        name: 'customers',
        component: () => import(/* webpackChunkName: "about" */ '../views/CustomersView.vue')
    },
    {
        path: '/historico',
        name: 'history',
        component: () => import(/* webpackChunkName: "about" */ '../views/HistoryView.vue')
    },
    {
        path: '/pagamentos',
        name: 'payments',
        component: () => import(/* webpackChunkName: "about" */ '../views/PaymentsView.vue')
    },
    {
        path: '/login',
        name: 'login',
        component: () => import(/* webpackChunkName: "login" */ '../views/LoginView.vue')
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
        component: () => import(/* webpackChunkName: "login" */ '../views/Orders')
    },
    {
        path: '/promocoes',
        name: 'promotions',
        component: () => import(/* webpackChunkName: "login" */ '../views/Promotions')
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
