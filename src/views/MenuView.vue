<template>
  <div class="menu" @skip-categories="skipCategories" :class="completeConfig ? '' : 'with-footer'">
    <Navbar :navbarData="navbarData" />
    <Sidebar :sidebarData="sidebarData" />
    
    <!-- FormMenu: Só exibe se não houver menus -->
    <div class="menu-new" v-if="menus.length === 0">
      <div class="container-small">
        <h2 class="text-center size-24 bold-700">Criar um novo cardápio</h2>
        <p class="text-center">Para começar, vamos criar seu primeiro cardápio.</p>
        <FormMenu :dataMenu="menus" :restaurantId="restaurantId" @menuCreated="onMenuCreated" />
      </div>
    </div>

    <!-- FormCategories: Só exibe se o menu selecionado não tiver categorias e se skipStepCategories for false -->
    <div class="menu-categories" v-else-if="(menus[selectedMenu].categories.length === 0) && !skipStepCategories">
      <div class="container-small">
        <h2 class="text-center size-24 bold-700">Meu cardápio</h2>
        <p class="text-center">Agora você precisa adicionar as categorias.</p>
        <FormCategories :menuId="menuId" @skipCategories="skipCategories" @saveCategories="saveCategories" />
      </div>
    </div>

    <!-- Menu: Exibe o menu principal -->
    <div class="menu-data" v-else>
      <Menu :dataMenu="menus" />
    </div>
  </div>
  
  <!-- Exibe o Footer se a configuração não estiver completa -->
  <Footer @nextConfigStep="nextConfigStep" :currentConfigStep="currentConfigStep" :countConfigSteps="countConfigSteps" v-if="!completeConfig" />
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
      completeConfig: this.$store.state.completeConfig,
      currentConfigStep: 4,
      countConfigSteps: 5,
      selectedMenu: 0,
      skipStepCategories: false,
      menuId: null,
    };
  },
  computed: {
    menus() {
      return this.$store.state.menus;
    },
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
  methods: {
    onMenuCreated(menuId) {
      this.menuId = menuId;
      this.selectedMenu = this.menus.length - 1;
    },
    saveCategories(allCategories) {
      if (Array.isArray(allCategories) && allCategories.length > 0) {
        this.menus[this.selectedMenu].categories = allCategories;
      }
    },
    skipCategories() {
      this.skipStepCategories = true;
    },
    nextConfigStep() {
      this.$router.push('/configuracoes');
    }
  },
  created() {
    this.$store.dispatch('fetchRestaurantId');
    this.$store.dispatch('fetchMenusAndItems');
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
  