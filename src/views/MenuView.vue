<template>
    <div class="menu" :class="completeConfig ? '' : 'with-footer'">
        <Navbar :navbarData="navbarData" />
        <Sidebar :sidebarData="sidebarData" />
        <div class="menu-new" v-if="!dataMenu.name">
            <div class="container-small">
                <h2 class="text-center size-24 bold-700">Criar um novo cardápio</h2>
                <p class="text-center">Para começar, vamos criar seu primeiro cardápio.</p>
                <FormMenu @save-menu-name="saveMenuName"/>
            </div>
        </div>
        <div class="menu-categories" v-else-if="!skipStepCategories && (!dataMenu.categories || dataMenu.categories.length === 0)">
            <div class="container-small">
                <h2 class="text-center size-24 bold-700">Meu cardápio</h2>
                <p class="text-center">Agora você precisa adicionar as categorias.</p>
                <FormCategories :dataMenu="dataMenu" @skip-categories="skipCategories" @save-categories="saveCategories"/>
            </div>
        </div>
        <div class="menu-data" v-else>
            <Menu :dataMenu="dataMenu"/>
        </div>
    </div>
    <Footer v-if="!completeConfig" @next-config-step="nextConfigStep" :currentConfigStep="currentConfigStep" :countConfigSteps="countConfigSteps"/>
</template>

<script>
import axios from 'axios';
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/Sidebar.vue";
import Footer from "../components/Footer.vue";
import FormMenu from "../components/menu/FormMenu.vue";
import FormCategories from "../components/menu/FormCategories.vue";
import Menu from "../components/menu/Menu.vue";

export default {
    name: "MenuView",
    data() {
        return {
            completeConfig: true,
            currentConfigStep: 1,
            countConfigSteps: 5,
            selectedMenu: 1,
            skipStepCategories: false,
            dataMenu: {
                name: "",
                id: null,
                categories: []
            },
            sidebarData: {
                logo: "/img/logo1.png",
                company: "TATÁ Sushi",
                address: "R. João Cachoeira, 278",
                active: "menu",
                message: "Configure os menus abaixo para começar a receber pedidos!",
                open: true,
                links: {
                    profile: { complete: true },
                    menu: { complete: true },
                    hours: { complete: true },
                    preparation: { complete: true },
                    config: { complete: true }
                }
            },
            navbarData: {
                // time: "9 horas",
                // notifications: 4
            }
        };
    },
    components: {
        Navbar,
        Sidebar,
        Footer,
        FormMenu,
        FormCategories,
        Menu
    },
    methods: {
        async checkMenuExists() {
            try {
                const response = await axios.get('https://projetoclick.uploading.net.br/public/api/menus?restaurant_id=1', {
                    headers: {
                        'Authorization': 'Bearer 3|XjRorVOeQOmIE0tobq8OJDaXGJURPTudEQLoMpxI08290b45'
                    }
                });

                console.log('Resposta da API:', response.data);

                if (response.data.data.length > 0) {
                    const menu = response.data.data[0];
                    this.dataMenu.name = menu.name;
                    this.dataMenu.id = menu.id;

                    // Agora vamos buscar as categorias para o menu
                    const categoriesResponse = await axios.get(`https://projetoclick.uploading.net.br/public/api/menus/${menu.id}/categories`, {
                        headers: {
                            'Authorization': 'Bearer 3|XjRorVOeQOmIE0tobq8OJDaXGJURPTudEQLoMpxI08290b45'
                        }
                    });

                    console.log('Categorias do menu:', categoriesResponse.data);

                    if (categoriesResponse.data.data.length > 0) {
                        this.dataMenu.categories = categoriesResponse.data.data;
                        this.completeConfig = true; // O cardápio e as categorias existem, então podemos pular para a configuração completa.
                        this.skipStepCategories = true; // Pulando a etapa de categorias, pois o cardápio já existe.
                    } else {
                        this.dataMenu.categories = []; // Garantir que categories está definido como um array vazio
                        this.completeConfig = false; // O cardápio não possui categorias, seguimos com o fluxo normal.
                    }
                } else {
                    this.dataMenu = { name: "", id: null, categories: [] }; // Garantir que dataMenu está definido corretamente
                    this.completeConfig = false; // O cardápio não existe, seguimos com o fluxo normal.
                }
            } catch (error) {
                console.error('Erro ao verificar o cardápio:', error);
                this.dataMenu = { name: "", id: null, categories: [] }; // Garantir que dataMenu está definido corretamente
                this.completeConfig = false;
            }
        },
        saveMenuName(menuName) {
            if (typeof menuName === "string" && menuName.trim() !== "") {
                this.dataMenu.name = menuName.trim();
                this.completeConfig = false; // Precisamos adicionar categorias, então não está completo ainda.
            }
        },
        saveCategories(allCategories) {
            if (typeof allCategories === "object" && allCategories.length > 0) {
                this.dataMenu.categories = allCategories;
                this.completeConfig = true; // Após adicionar categorias, a configuração está completa.
            }
        },
        skipCategories() {
            this.skipStepCategories = true;
            this.completeConfig = true; // Se pular categorias, consideramos a configuração completa.
        },
        nextConfigStep() {
            this.$router.push('/horario');
        }
    },
    async mounted() {
        await this.checkMenuExists();
    }
};
</script>

<style lang="scss" scoped>
.menu-new, .menu-categories {
    display: grid;
    align-items: center;
    justify-content: center;
    height: 70vh;
}
</style>
