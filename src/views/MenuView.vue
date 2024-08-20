<template>
    <div class="menu" @skip-categories="skipCategories" :class="completeConfig ? '' : 'with-footer'">
      <Navbar :navbarData="navbarData" /><Sidebar :sidebarData="sidebarData" />
      <div class="menu-new" v-if="dataMenu.length === 0">
        <div class="container-small">
          <h2 class="text-center size-24 bold-700">Criar um novo cardápio</h2>
          <p class="text-center">Para começar, vamos criar seu primeiro cardápio.</p>
          <FormMenu :dataMenu="dataMenu" :restaurantId="restaurantId" @menuCreated="onMenuCreated" />
        </div>
      </div>
      <div class="menu-categories" v-else-if="(typeof dataMenu[selectedMenu].categories !== 'object' || dataMenu[selectedMenu].categories.length === 0) && skipStepCategories === false">
        <div class="container-small">
          <h2 class="text-center size-24 bold-700">Meu cardápio</h2>
          <p class="text-center">Agora você precisa adicionar as categorias.</p>
          <FormCategories :menuId="menuId" @skipCategories="skipCategories" @saveCategories="saveCategories" />
        </div>
      </div>
      <div class="menu-data" v-else>
        <Menu :dataMenu="dataMenu" />
      </div>
    </div>
    <Footer @nextConfigStep="nextConfigStep" :currentConfigStep="currentConfigStep" :countConfigSteps="countConfigSteps" v-if="completeConfig === false" />
  </template>
  
  <script>
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
        completeConfig: false,
        currentConfigStep: 2,
        countConfigSteps: 5,
        selectedMenu: 0,
        skipStepCategories: false,
        dataMenu: [],
        menuId: null, // Armazena o ID do menu criado
        sidebarData: {
          logo: "/img/logo1.png",
          company: "TATÁ Sushi",
          address: "R. João Cachoeira, 278",
          active: "menu",
          message: "Configure os menus abaixo para começar a receber pedidos!",
          open: true,
          links: {
            strore: {},
            profile: { complete: true },
            menu: { complete: false },
            hours: { complete: false },
            preparation: { complete: false },
            config: { complete: false }
          }
        },
        navbarData: {},
      };
    },
    computed: {
      restaurantId() {
        return this.$store.state.restaurantId;
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
    created() {
      this.$store.dispatch('fetchRestaurantId');
    },
    methods: {
      onMenuCreated(menuId) {
        // Depois que o menu é criado, salva o ID do menu e mostra o componente de categorias
        this.menuId = menuId;
        this.selectedMenu = this.dataMenu.length - 1; // Seleciona o menu recém-criado
      },
      saveCategories(allCategories) {
        if (typeof allCategories === "object" && allCategories.length > 0) {
          this.dataMenu[this.selectedMenu].categories = allCategories;
        }
      },
      skipCategories() {
        this.skipStepCategories = true;
      },
      nextConfigStep() {
        this.$router.push('/horario');
      }
    }
  };
  </script>
  
  
  <style lang="scss" scoped>
  .menu-new,
  .menu-categories {
    display: grid;
    align-items: center;
    justify-content: center;
    height: 70vh;
  }
  </style>
  