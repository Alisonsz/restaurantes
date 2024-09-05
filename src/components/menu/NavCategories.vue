<template>
  <div>
    <div class="row mb-3 mt-3">
      <div class="col-6"></div>
      <div class="col-6 create-new text-end">
        <button @click="addNewCategory" type="button" class="btn btn-green new-category">
          <span class="add-item add-inline add-black ml-1"></span> Adicionar categoria
        </button>
      </div>
    </div>
    <div class="pb-4">
      <div class="row mt-4 mb-0">
        <div class="col-6">
          <p class="bold-500 mb-0 pb-0">Nome da categoria</p>
        </div>
        <div class="col-6 create-new text-end">
          <p class="bold-500 mb-0 pb-0 acertar">Cardápios</p>
        </div>
      </div>
      <div v-if="categories.length === 0">
        <hr>
        <p class="mt-4">Você ainda não adicionou nenhuma categoria ao seu cardápio. Comece agora para atrair cada vez mais clientes!</p>
      </div>
      <div class="table-data" v-for="(category, index) in categories" :key="index">
        <hr>
        <div class="row mt-4 mb-0">
          <div class="col-6">
            <p class="mb-0 pb-0">{{ category.name }}</p>
          </div>
          <div class="col-6 create-new text-end">
            <span class="mb-0 pb-0 btn-round verde input-base" v-for="(menu, i) in category.menus" :key="i">{{ menu.name }}</span>
            <button class="btn btn-round edit-button input-base" @click="editCategory(index)">
              <span class="edit-data"></span>
              <span class="text">Editar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <Teleport to="body">
      <ModalFormCategory :show="showModalFormCategory" @close="resetForm">
        <template #header>Editar Categoria</template>
        <template #body>
          <FormCategory
            @close-modal="resetForm"
            @save-category="saveCategory"
            @categorySaved="onCategoryUpdated" 
            @categoryDeleted="onCategoryUpdated" 
            :dataMenu="allMenus"
            :selectedCategory="selectedCategory"
          />
        </template>
      </ModalFormCategory>
    </Teleport>
  </div>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';
import FormCategory from "./FormCategory2.vue";
import ModalFormCategory from "../ModalBase.vue";

export default {
  name: "NavCategories",
  components: {
    FormCategory,
    ModalFormCategory,
  },
  data() {
    return {
      categories: [],  // Armazena as categorias recebidas da API
      showModalFormCategory: false,
      selectedCategory: null, // Objeto da categoria selecionada
    };
  },
  computed: {
    ...mapState(['token', 'restaurantId']), // Obtém token e restaurantId do store
    allMenus() {
      return this.categories.flatMap(category => category.menus);
    },
  },
  mounted() {
    this.fetchCategories();
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await axios.get(`https://api.prattuapp.com.br/api/category-products?restaurant_id=${this.restaurantId}`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });
        this.categories = response.data.data;  // Armazena as categorias da API
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      }
    },
    onCategoryUpdated() {
      // Refaz a requisição para obter as categorias atualizadas
      this.fetchCategories();
    },
    saveCategory(categoryData) {
      this.resetForm();
    },
    editCategory(index) {
      this.selectedCategory = this.categories[index];
      this.showModalFormCategory = true;
    },
    resetForm() {
      this.selectedCategory = null;
      this.showModalFormCategory = false;
    },
    addNewCategory() {
      this.resetForm();
      this.showModalFormCategory = true;
    }
  },
};
</script>


<style lang="scss" scoped>
.create-new {
  text-align: right;
  .new-menu {
    border: 1px solid $gray-line;
    margin-right: 20px;
  }
  button {
    padding-left: 20px;
    padding-right: 20px;
  }
}

.table-data .input-base {

  margin-left: 10px;

  white-space: nowrap;
}
.edit-button{
  margin-left: 5px;
  background-color: white !important;
  padding: 8px 16px 8px 16px !important;
  height: 36x !important;
  top: -3px !important;
}
.verde{
  background-color: #D0F4EA;
  display: inline-block;
  padding: 12px 15px;

  border-radius: 50%;
  margin-left: 10px;
  white-space: nowrap;
}
.acertar{
  margin-right: 105px !important;
}
</style>
