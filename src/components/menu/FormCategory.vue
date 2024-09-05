<template>
  <div class="container-data">
    <form>
      <div>
        <!-- Botões de ação para categorias -->
        <div v-if="hasSelectedMenuIndex && !showCreateCategoryForm && !showSearchCategoryForm" class="d-grid">
          <button
            type="button"
            class="btn btn-save"
            @click="showCreateCategoryForm = true; showSearchCategoryForm = false"
          >
            Criar nova categoria
          </button>
          <button
            type="button"
            class="btn btn-save mt-2"
            @click="showSearchCategoryForm = true; showCreateCategoryForm = false"
          >
            Buscar categoria existente
          </button>
        </div>

        <!-- Formulário de criação de nova categoria -->
        <div v-if="showCreateCategoryForm && hasSelectedMenuIndex" class="d-grid mt-3">
          <label for="newCategoryName" class="form-label bold-500 mb-0">
            Nome da nova categoria
          </label>
          <input
            type="text"
            class="form-control"
            id="newCategoryName"
            v-model="categoryData.categoryName"
            placeholder="Ex: Sobremesas"
          />
          <button
            type="button"
            class="btn btn-save mt-2"
            @click="saveNewCategory"
          >
            Salvar
          </button>
          <p class="mb-0 required-alert" v-show="invalid.categoryName">
            *Campo obrigatório
          </p>
        </div>

        <!-- Formulário de busca de categoria existente -->
        <div v-if="showSearchCategoryForm && hasSelectedMenuIndex" class="d-grid mt-3">
          <label for="categorySearch" class="form-label bold-500 mb-0">
            Buscar categoria
          </label>
          <input
            type="text"
            class="form-control"
            id="categorySearch"
            placeholder="Digite para buscar..."
            v-model="categoryTerm"
          />
          <ul
            v-if="categoryTerm.length > 0 && filteredCategories.length > 0"
            class="w-full rounded search-list"
            role="list"
          >
            <li v-for="(category, index) in filteredCategories" :key="index">
              <span>{{ category.name }}</span>
              <span
                role="button"
                class="add-item add-right add-on"
                @click="addCategory(category); categoryTerm = ''"
              ></span>
            </li>
          </ul>

          <!-- Exibição das Categorias Selecionadas - MOVIDO PARA CIMA -->
          <div
            class="selected-categories position-relative d-inline-block mt-2"
            v-if="categoryData.selectedCategories.length > 0"
          >
            <span class="btn-round input-base edit-button"
              v-for="(category, index) in categoryData.selectedCategories"
              :key="index"
            >
              {{ category.name }}
              <button @click="removeCategory(index)" class="btn-remove-menu">X</button>
            </span>
          </div>

          <!-- Botão Salvar -->
          <button
            type="button"
            class="btn btn-save distance mt-2"
            @click="saveExistingCategory"
          >
            Salvar
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';

export default {
  name: "FormCategory",
  props: {
    selectedMenuIndex: {
      type: Number,
      default: null,
    },
    dataMenu: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    const menuTerm = ref('');
    const categoryTerm = ref('');
    const categoriesList = ref([]);
    const showCreateCategoryForm = ref(false);
    const showSearchCategoryForm = ref(false);

    const hasSelectedMenuIndex = computed(() => props.selectedMenuIndex !== null);

    const filteredCategories = computed(() => {
      if (categoryTerm.value.trim() === '') {
        return [];
      }
      return categoriesList.value.filter((category) => {
        return category.name.toLowerCase().includes(categoryTerm.value.toLowerCase());
      });
    });

    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://api.prattuapp.com.br/api/restaurants/1/product-categories', {
          headers: {
            Authorization: `Bearer ${store.state.token}`,
          },
        });
        categoriesList.value = response.data.categories;
      } catch (error) {
        console.error('Erro ao buscar categorias:', error.response ? error.response.data : error.message);
      }
    };

    watch(categoryTerm, async (newTerm) => {
      if (newTerm) {
        await fetchCategories();
      }
    });

    onMounted(() => {
      if (hasSelectedMenuIndex.value) {
        fetchCategories();
      }
    });

    return {
      menuTerm,
      categoryTerm,
      filteredCategories,
      hasSelectedMenuIndex,
      showCreateCategoryForm,
      showSearchCategoryForm,
      fetchCategories,
      store,
    };
  },
  data() {
    return {
      invalid: {
        categoryName: false,
      },
      categoryData: {
        selectedMenu: [],
        selectedCategories: [],
        categoryName: "",
      },
    };
  },
  methods: {
    addCategory(category) {
      if (!this.categoryData.selectedCategories.find((item) => item.id === category.id)) {
        this.categoryData.selectedCategories.push(category);
      }
    },
    removeCategory(index) {
      this.categoryData.selectedCategories.splice(index, 1);
      if (this.categoryData.selectedCategories.length === 0) {
        this.showCreateCategoryForm = false;
        this.showSearchCategoryForm = false;
      }
    },
    valid(data) {
      let isValid = true;
      if (this.categoryData.selectedMenu.length === 0) {
        isValid = false;
        this.invalid.selectedMenu = true;
      } else {
        this.invalid.selectedMenu = false;
      }

      if (this.categoryData.selectedCategories.length === 0 && !this.showCreateCategoryForm) {
        isValid = false;
        this.invalid.selectedCategories = true;
      } else {
        this.invalid.selectedCategories = false;
      }

      if (this.showCreateCategoryForm && this.categoryData.categoryName.trim() === '') {
        isValid = false;
        this.invalid.categoryName = true;
      } else {
        this.invalid.categoryName = false;
      }

      return isValid;
    },
    async saveNewCategory() {
      if (this.valid(this.categoryData)) {
        try {
          const response = await axios.post(
            'https://api.prattuapp.com.br/api/menus/add-category-to-menu',
            {
              name: this.categoryData.categoryName,
              menu_ids: this.categoryData.selectedMenu.map(menu => menu.id),
              restaurant_id: this.store.state.restaurantId,
            },
            {
              headers: {
                Authorization: `Bearer ${this.store.state.token}`,
                'Content-Type': 'application/json',
              },
            }
          );
          await this.store.dispatch('fetchMenusAndItems');
          this.$emit('closeModal');
        } catch (error) {
          console.error('Erro ao criar nova categoria:', error.response ? error.response.data : error.message);
        }
      } else {
        console.error('Campos obrigatórios não preenchidos.');
      }
    },
    async saveExistingCategory() {
      if (this.valid(this.categoryData)) {
        try {
          const response = await axios.post(
            `https://api.prattuapp.com.br/api/menus/${this.categoryData.selectedMenu[0].id}/attach-categories`,
            {
              category_ids: this.categoryData.selectedCategories.map(category => category.id),
            },
            {
              headers: {
                Authorization: `Bearer ${this.store.state.token}`,
                'Content-Type': 'application/json',
              },
            }
          );
          await this.store.dispatch('fetchMenusAndItems');
          this.$emit('closeModal');
        } catch (error) {
          console.error('Erro ao associar categoria existente:', error.response ? error.response.data : error.message);
        }
      } else {
        console.error('Campos obrigatórios não preenchidos.');
      }
    },
  },
  mounted() {
    if (this.selectedMenuIndex !== null && this.dataMenu[this.selectedMenuIndex]) {
      this.categoryData.selectedMenu.push(this.dataMenu[this.selectedMenuIndex]);
      this.fetchCategories();
    }
  },
};
</script>


<style lang="scss" scoped>
.modal-body .container-data {
  width: 330px !important;
  padding: 0 !important;
}

.modal-container {
  min-width: 350px !important;
}

.autocomplete-local {
  position: absolute;
  width: 100%;
  margin-top: 28px;
}

.autocomplete-local .search-list {
  top: 48px;
}

.search-space {
  margin-top: 0;
  margin-bottom: 25px;
  height: 43px;
}

/* Remover largura total das categorias selecionadas */
.selected-categories {
  display: inline-block; /* Ocupa apenas o espaço necessário */

  position: relative;
}

/* Cada categoria só ocupa o espaço necessário */
.selected-categories span {
  white-space: nowrap;
  display: inline-block; /* Mantém o comportamento de ocupar apenas o espaço necessário */
  background-color: $light-blue;

  font-size: 14px;
  padding: 10px;
  border-radius: 20px;
  position: relative; /* Necessário para posicionar o botão de remoção corretamente */
}

/* Botão de remoção posicionado acima da categoria */
.btn-remove-menu {
  position: absolute;
  top: -3px; /* Colocado acima da categoria */
  right: 0px; /* Ajuste no canto direito */
  width: 15px !important;
  height: 15px !important;
  background-color: red;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 10px !important;
  line-height: 1px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

/* Ajuste do botão de edição para cinza */
.edit-button {
  background-color: #f0f0f0 !important;
  color: #333333 !important;
  border: none;
 
}

/* Gap de 15px entre os componentes dentro de "Buscar categoria existente" */
.d-grid.mt-3 > * {
  margin-bottom: 5px !important;
}



</style>

