<template>
 <!--  <div class="menu" @skip-categories="skipCategories" :class="completeConfig ? '' : 'with-footer'">
        <Navbar :navbarData="navbarData" /><Sidebar :sidebarData="sidebarData" />
        <div class="menu-new" v-if="dataMenu.length === 0">
            <div class="container-small">
                <h2 class="text-center size-24 bold-700">Criar um novo cardápio</h2>
                <p class="text-center">Para começar, vamos criar seu primeiro cardápio.</p>
                <FormMenu :dataMenu="dataMenu" @save-menu-name="saveMenuName"/>
            </div>
        </div>
        <div class="menu-categories" v-else-if="(typeof dataMenu[0].categories !== 'object' || dataMenu[0].categories.length === 0) && skipStepCategories === false">
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
    <Footer @next-config-step="nextConfigStep" :currentConfigStep="currentConfigStep" :countConfigSteps="countConfigSteps" v-if="completeConfig === false"/>
-->
<div class="menu" @skip-categories="skipCategories" :class="completeConfig ? '' : 'with-footer'">
    <Navbar :navbarData="navbarData" /><Sidebar :sidebarData="sidebarData" />
    
    <!-- Menu Data Always Displayed -->
    <div class="menu-data">
      <Menu :dataMenu="dataMenu"/>
    </div>

    <Footer @next-config-step="nextConfigStep" :currentConfigStep="currentConfigStep" :countConfigSteps="countConfigSteps" v-if="completeConfig === false"/>
  </div>

</template>


<script>
    import Navbar from "../components/Navbar.vue";
    import Sidebar from "../components/Sidebar.vue";
    import Footer from "../components/Footer.vue";
    import FormMenu from "../components/menu/FormMenu.vue"
    import FormCategories from "../components/menu/FormCategories.vue"
    import Menu from "../components/menu/Menu.vue"
    
    export default {
        name: "MenuView",
        data() {
            return {
                completeConfig: false,
                currentConfigStep: 2,
                countConfigSteps: 5,
                selectedMenu: 0,
                skipStepCategories: false,
                dataMenu: [],
                sidebarData: {
                    logo: "/img/logo1.png",
                    company: "TATÁ Sushi",
                    address: "R. João Cachoeira, 278",
                    active: "menu",
                    message: "Configure os menus abaixo para começar a receber pedidos!",
                    open: true,
                    links: {
                        profile: { complete: true },
                        menu: { complete: false },
                        hours: { complete: false },
                        preparation: { complete: false },
                        config: { complete: false }
                    }
                },
                navbarData: {
                    /*
                    time: "9 horas",
                    notifications: 4
                    */
                }
            }            
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
            saveMenuName(menuName) {
                if (typeof menuName === "string" && menuName.trim() !== "") {
                    this.dataMenu.push({ name: menuName.trim(), categories: [] }); 
                }
            },
            saveCategories(allCategories) {
                if (typeof allCategories === "object" && allCategories.length > 0) {
                    this.dataMenu[0].categories = allCategories; 
                }
            },
            skipCategories() {
                this.skipStepCategories = true;
            },
            nextConfigStep() {
                this.$router.push('/horario');
            }
        }
    }
</script>

<style lang="scss" scoped>
    .menu-new, .menu-categories {
        display: grid;
        align-items: center;
        justify-content: center;
        height: 70vh;
    }
</style>