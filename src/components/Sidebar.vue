<template>
    <div class="sidebar border border-right col p-0 sidebar-size" :class="open ? 'open' : ''">
        <a class="navbar-brand icon-double-arrow-left" href="#" @click.prevent="openClose()"></a>
        <div class="offcanvas-md offcanvas-end" tabindex="-1" id="sidebarMenu" aria-labelledby="sidebarMenuLabel">
            <div class="offcanvas-body d-md-flex flex-column p-0 pt-lg-0">
                <div class="row data-company">
                    <div class="company-logo">
                        <img class="logo" :src="sidebarData.logo" :alt="sidebarData.company">
                    </div>
                    <div class="col">
                        <span class="company-name">{{ sidebarData.company }}</span>
                        <span class="company-adress">{{ sidebarData.address }}</span>
                    </div>
                </div>
                <div class="sublinks-floating" :style="{ top: positionSublink + 'px' }" v-show="visibleSublink">
                    <span v-for="(sublink, i) in selectedSublinks" :key="i">
                        <p :class="[sidebarData.active === i ? 'item-active' : '']" v-if="typeof sidebarData.links !== 'object' || typeof sidebarData.links[i] === 'object'">
                            <router-link class="nav-sublink" :to="sublink.route">
                                <span class="sidbar-icon" :class="sublink.icon"></span>
                                <span class="sublink-name">{{ sublink.name }}</span>
                            </router-link>
                        </p>
                    </span>
                </div>
                <div class="menu-content" @scroll="visibleSublink = false">
                    <p class="message" v-if="typeof sidebarData.message === 'string'">{{ sidebarData.message }}</p>
                    <ul class="nav nav-top flex-column" :class="typeof sidebarData.message === 'string' ? '' : 'mt-1'">
                        <div v-for="(link, index) in links" :key="index">
                            <li class="nav-item" :class="typeof link.sublinks === 'object' ? 'with-sublink' : ''" v-if="typeof sidebarData.links !== 'object' || typeof sidebarData.links[index] === 'object'">
                                <span v-if="typeof link.sublinks === 'object'" @click="selectSublink(index, link.sublinks, $event)" ref="clickableElement">
                                    <a class="nav-link d-flex align-items-center collapsed" data-bs-toggle="collapse" :href="'#sublinks' + index" aria-expanded="false" :aria-controls="'sublinks' + index" :class="[parentMenu === index ? 'menu-parent' : '']">
                                        <span class="sidbar-icon" :class="link.icon" v-tippy="open ? '' : link.name"></span>
                                        <span class="name">{{ link.name }}</span>
                                        <span class="sublink-icon"></span>
                                    </a>
                                    <div class="sublinks-list float-left collapse" :id="'sublinks' + index" data-bs-parent=".nav-top" :class="[parentMenu === index ? 'show' : '']">
                                        <div class="sublink" v-for="(sublink, i) in link.sublinks" :key="i">
                                            <span v-if="typeof sidebarData.links !== 'object' || typeof sidebarData.links[i] === 'object'" :class="'menu-'+i">
                                                <router-link class="nav-link d-flex align-items-center sublink" aria-current="page" :to="sublink.route" :class="[sidebarData.active === i ? 'icon-active' : '']">
                                                    <span class="sidbar-icon info-icon" :class="checkAddIcon(i)"></span>
                                                    <span class="sidbar-icon" :class="sublink.icon"></span>
                                                    <span class="name">{{ sublink.name }}</span>
                                                </router-link>
                                            </span>
                                        </div>
                                    </div>
                                </span>
                                <router-link class="nav-link d-flex align-items-center" aria-current="page" v-else :to="link.route" :class="[sidebarData.active === index ? 'icon-active ' : '']">
                                    <span class="sidbar-icon info-icon" :class="checkAddIcon(index)"></span>
                                    <span class="sidbar-icon" :class="link.icon"></span>
                                    <span class="name">{{ link.name }}</span>
                                </router-link>
                            </li>
                        </div>
                    </ul>
                    <ul class="nav nav-bottom flex-column">
                        <li class="nav-item item-help">
                            <router-link to="/ajuda" class="nav-link d-flex align-items-center" aria-current="page">
                                <span class="sidbar-icon icon-helper" v-tippy="open ? '' : 'Ajuda'"></span>
                                <span class="name">Ajuda</span>
                            </router-link>
                        </li>
                        <li class="nav-item item-exit">
                            <router-link to="/" class="nav-link d-flex align-items-center" aria-current="page">
                                <span class="sidbar-icon icon-power" v-tippy="open ? '' : 'Sair'"></span>
                                <span class="name">Sair</span>
                            </router-link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: "Sidebar",
    data() {
        return {
            open: false,
            lastLink: "",
            selectedSublinks: [],
            positionSublink: 0,
            visibleSublink: false,
            parentMenu: '',
            links: {
                monitor: { 
                    icon: "icon-monitor", 
                    name: "Monitor Performance", 
                    sublinks: {
                    
                        overview: { icon: "icon-grid", name: "Visão geral", route: "/visao" },
                        sales: { icon: "icon-performance", name: "Vendas", route: "/vendas" },
                        operacional: { icon: "icon-efficiency", name: "Eficiência operacional", route: "/operacional" },
                        customers: { icon: "icon-customers", name: "Análise de clientes", route: "/clientes" },
                        performance: { icon: "icon-insights", name: "Performance do cardápio", route: "/performance" },
                        payments: { icon: "icon-payment", name: "Pagamentos", route: "/pagamentos" },
                    }
                },
                store: {
                    icon: "icon-settings", 
                    name: "Configuração da loja", 
                    sublinks: {
                        hours: { icon: "icon-clock", name: "Horário funcionamento", route: "/horario" },
                        preparation: { icon: "icon-pot", name: "Tempo de preparacão", route: "/preparo" },
                        profile: { icon: "icon-account", name: "Perfil", route: "/perfil" },
                        menu: { icon: "icon-summarize", name: "Cardápio", route: "/cardapio" },
                        config: { icon: "icon-slider", name: "Configurações da conta", route: "/configuracoes" },
                        promotions: { icon: "icon-promotion", name: "Promoções", route: "/promocoes" },
                    }
                },
                management: {
                    icon: "icon-clipboard", 
                    name: "Gestor de pedidos", 
                    sublinks: {
                        orders: { icon: "icon-assignment", name: "Pedidos", route: "/pedidos" },
                        history: { icon: "icon-summarize", name: "Histórico de pedidos", route: "/historico" },
                        support: { icon: "icon-support", name: "Chamados/suporte", route: "/suporte" },
                    }
                }
            }
        } 
    },
    computed: {
        ...mapState(['sidebarData'])
    },
    methods: {
        openClose() {
            this.open = !this.open;
            this.visibleSublink = false;
            const mainElement = document.querySelector('main');
            const firstChild = mainElement.querySelector('div');
            if (this.open) {
                firstChild.style.marginLeft = '280px';
                firstChild.classList.add('sidebar-open');
            } else {
                firstChild.style.marginLeft = '90px';
                firstChild.classList.remove('sidebar-open');
            }
        },
        checkAddIcon(index) {
            if (typeof this.sidebarData.links === "object") {
                if (typeof this.sidebarData.links[index] === "object") {
                    if (typeof this.sidebarData.links[index].complete === "boolean") {
                        if (this.sidebarData.links[index].complete) {
                            return 'check-on';
                        } else {
                            return 'icon-alert';
                        }
                    } else {
                        return 'd-none';
                    }
                } else {
                    return 'd-none';
                }
            } else {
                return 'd-none';
            }
        },
        selectSublink(link, sublinks, event) {
            this.visibleSublink = link === this.lastLink ? !this.visibleSublink : true;
            this.lastLink = link;
            const rect = event.target.getBoundingClientRect();
            this.positionSublink = rect.top - 30;
            this.selectedSublinks = sublinks;
        },
        findParentMenu(menu) {
            for (const parentKey in this.links) {
                const link = this.links[parentKey];
                if (link.sublinks) {
                    for (const key in link.sublinks) {
                        if (key === menu) {
                            return parentKey;
                        }
                    }
                }
            }
            return null;
        }
    },
    mounted() {
        this.open = this.sidebarData.open;
        const mainElement = document.querySelector('main');
        const firstChild = mainElement.querySelector('div');
        if (this.open) {
            firstChild.style.marginLeft = '280px';
            firstChild.classList.add('sidebar-open');
        } else {
            firstChild.style.marginLeft = '90px';
            firstChild.classList.remove('sidebar-open');
        }
        this.parentMenu = this.findParentMenu(this.sidebarData.active);
    }
};
</script>


<style lang="scss" scoped>
    .message,
    .company-name,
    .company-adress,
    .nav-item .info-icon,
    .nav-item .name {
        display: none;
    }
    .logo {
        width: 31px;
        height: 32px;
        margin: auto;
        margin-top: 20px;
        margin-left: 20px !important;
    }
    .data-company {
        width: 100%;
    }
    .sidebar-size {
        width: 72px;
        height: 100%;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        z-index: 1100;
        border: none !important;
        background-color: $black-primary;
    }
    .sidebar .icon-double-arrow-left {
        margin-left: 20px;
        margin-top: 6px;
        text-align: center;
        width: 30px;
        height: 30px;
        background-size: 25px 25px;
        background-repeat: no-repeat;
        background-position: center center;
        display: block;
        position: absolute;
        right: -50px;
        top: 13px;
    }
    .sidbar-icon {
        text-align: center;
        width: 30px;
        height: 30px;
        background-size: 20px 20px;
        background-repeat: no-repeat;
        background-position: center center;
        margin: auto;
    }
    .nav {
        --bs-nav-link-padding-y: 0 !important;
        display: inline-block;
    }
    .nav-top {
        margin-bottom: 25px;
    }
    .nav-top li {
        padding-top: 30px;
        padding-bottom: 30px;
        width: 30px;
        margin: auto;
        border-bottom: 1px solid $gray-space;
    }
    .nav-bottom {
        margin-top: auto;
        width: 100%;
    }
    .icon-active .sidbar-icon {
        opacity: 1 !important;
    }
    .nav-top .nav-item {
        width: 50px !important;
    }
    .nav-item .sidbar-icon {
        opacity: 0.3;
    }
    .sidebar.open * {
        color: $white-primary;
    }
    .nav-top .nav-item .sublink {
        padding: 8px 0 8px 0;
    }
    .nav-top .nav-item .nav-sublink {
        text-decoration: none;
    }
    li.nav-item.with-sublink .sublink-icon {
        position: absolute;
        right: 8px;
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-bottom: 5px solid white;
        border-top: none;
    }
    li.nav-item.with-sublink .collapsed .sublink-icon {
        border-bottom: none;
        border-top: 5px solid white;
    }
    .sublink-icon {
        display: none;
    }
    .sublinks-floating {
        background-color: $black-primary;
        min-width: 265px;
        position: absolute; 
        left: 72px;
        padding: 10px 20px;
        p {
            padding: 0;
            margin: 15px 0;
            line-height: 1;
            opacity: 0.3;
            a {
                text-decoration: none;
                color: $white-primary
            }
        }
        .sidbar-icon {
            display: inline-block !important;
        }
        .sublink-name {
            display: inline-block;
            transform: translateY(-9px);
            padding-left: 10px;
        }
    }
    
    .sidebar:not(.open) .sublink {
        display: none !important;
    }

    .sidebar.open {
        width: 260px;
        .message,
        .nav-item .info-icon,
        .nav-item .name {
            display: inline-block;
        }
        .message {
            padding: 50px 20px 15px 20px;
            font-weight: 400;
        }
        .nav-item {
            width: calc(100% - 30px) !important;
            padding: 20px 0;
            font-size: 16px !important;
            position: relative;
        }
        .nav-item .name {
            font-size: 16px !important;
            margin-left: 8px;
            opacity: 0.3;
        }
        .sublink-icon {
            opacity: 0.3;
        }
        .nav-item .nav-link {
            padding-left: 0 !important;
            padding-right: 0 !important;
        }
        .nav-item .d-flex {
            display: inline-flex !important
        }
        .nav-top .nav-item {
            padding-top: 25px !important;
        }
        .nav-top .icon-active {
            background-color: $black-secondary;
            border-radius: 9px;
            width: 100%;
        }
        .nav-top .icon-active .name {
            width: calc(100% - 42px);
            opacity: 1 !important;
        }
        .icon-active .sidbar-icon {
            width: 40px;
            background-position: center right;
            margin-left: -8px;
            opacity: 1 !important;
        }
        .icon-active .sublink-icon {
            right: 8px !important;
            opacity: 1 !important;
        }
        .icon-active .info-icon {
            display: none;
        }
        .sublink-icon {
            display: block !important;
        }

        .nav-top .menu-orders .nav-link {
            background-color: $light-green;
            border-radius: 9px;
            .name {
                opacity: 1 !important;
                padding-right: 18px;
                color: $black-secondary;
                font-weight: 500;
            }
            .sidbar-icon {
                width: 40px;
                background-position: center right;
                margin-left: -8px;
                opacity: 1 !important;
            }
            .sublink-icon {
                right: 8px !important;
                opacity: 1 !important;
            }
            .info-icon {
                display: none;
            }
        }

        .company-logo {
            width: 75px !important;
            text-align: right
        }
        .company-name {
            font-size: 16px;
            font-weight: 700;
            display: block;
            margin-top: 15px;
        }
        .company-adress {
            display: block;
            font-size: 12px;
            font-weight: 500;
        }
        .nav-bottom .nav-item{
            margin-left: 15px !important;
        }
        .icon-double-arrow-left {
            -moz-transform: scaleX(-1);
            -o-transform: scaleX(-1);
            -webkit-transform: scaleX(-1);
            transform: scaleX(-1);
        }
        .sublinks-floating {
            display: none;
        }
        .item-help {
            padding-top: 5px;
            padding-bottom: 5px;
        }
        .sublinks-list {
            padding-top: 15px;
        }
    }

    .menu-content {
        overflow-y: auto;
        overflow-x: hidden;
        height: calc(100vh - 70px);
        margin-top: 12px;
        display: flex;
        flex-direction: column;
    }
    .menu-content::-webkit-scrollbar {
        width: 12px;  
    }
    .menu-content::-webkit-scrollbar-track {
        background: transparent;       
    }
    .menu-content::-webkit-scrollbar-thumb {
        background-color: $gray-primary;    
        border-radius: 20px;       
        border: 3px solid $black-primary; 
    }

    .menu-parent {
        .sidbar-icon {
            opacity: 1 !important;
        }
        .name {
            opacity: 1 !important;
        }
        .sublink-icon {
            opacity: 1 !important;
        }
    }
    .item-active {
        opacity: 1 !important;
    }

    .item-help {
        padding-top: 25px;
        padding-bottom: 25px;
    }
    .item-exit {
        padding-bottom: 25px;
    }

    @media (max-height: 950px) {
        .nav-top li {
            padding-top: 20px !important;
            padding-bottom: 20px !important;
        }
    }
</style>