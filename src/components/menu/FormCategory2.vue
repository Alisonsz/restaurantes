<template>
  <div class="container-data">
    <form>
      <div>
        <div class="d-grid mt-2 mb-3">
          <label for="name" class="form-label bold-500 mb-0">Nome da categoria</label>
          <input
            type="text"
            class="form-control"
            id="name"
            v-model="categoryData.categoryName"
            placeholder="Ex: Prato principal"
          />
          <p class="mb-0 required-alert" v-show="invalid.categoryName">
            *Campo obrigatório
          </p>
        </div>

        <div class="d-grid">
          <label for="menuSearch" class="form-label bold-500 mb-0 mt-1">
            Adicione a um cardápio
          </label>
          <div class="autocomplete-local">
            <input
              type="text"
              class="form-control"
              id="menuSearch"
              placeholder="Digite..."
              v-model="menuTerm"
            />
            <ul
              v-if="menuTerm.length > 0 && searchMenus.length > 0"
              class="w-full rounded search-list"
              role="list"
            >
              <li v-for="(menu, index) in searchMenus" :key="index">
                <span>{{ menu.name }}</span>
                <span
                  role="button"
                  class="add-item add-right add-on"
                  @click="addMenu(menu); menuTerm = ''"
                ></span>
              </li>
            </ul>
          </div>
          <div class="search-space"></div>
          <p class="mb-0 required-alert" v-show="invalid.selectedMenu">
            *Campo obrigatório
          </p>
        </div>

        <div
          class="selected-menus"
          v-if="categoryData.selectedMenu.length > 0"
        >
          <span
            v-for="(menu, index) in categoryData.selectedMenu"
            :key="index"
          >
            {{ menu.name }}
            <button
              type="button"
              @click="removeMenu(menu)"
              class="btn btn-remove-menu"
            >
              X
            </button>
          </span>
        </div>
        <div class="d-flex justify-content-end mt-3 button-group">
          <button
            v-if="isEditing"
            @click.prevent="deleteCategory"
            type="button"
            class="btn btn-danger"
          >
            Excluir
          </button>
          <button @click.prevent="save" type="submit" class="btn btn-save me-2">
            {{ isEditing ? 'Salvar' : 'Criar nova categoria' }}
          </button>
         
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, computed, reactive, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';

export default {
  name: "FormCategory",
  props: {
    selectedCategory: {
      type: Object,
      default: null,
    },
  },
  setup(props, { emit }) {
    const store = useStore();

    const menuList = ref([]); // Será atualizado com os dados da API
    const menuTerm = ref('');
    const categoryData = reactive({
      selectedMenu: [],
      categoryName: "",
    });
    const removedMenus = ref([]); // Armazena os menus removidos
    const invalid = reactive({
      selectedMenu: false,
      categoryName: false,
    });

    const isEditing = computed(() => props.selectedCategory !== null);

    // Função para buscar os cardápios da API
    const fetchMenus = async () => {
      try {
        const response = await axios.get('https://api.prattuapp.com.br/api/menus?restaurant_id=1', {
          headers: {
            Authorization: `Bearer ${store.state.token}`, // Token de autenticação se necessário
          },
        });
        menuList.value = response.data.data; // Atualiza menuList com os dados retornados da API
      } catch (error) {
        console.error('Erro ao buscar menus:', error.response ? error.response.data : error.message);
      }
    };

    // Função para filtrar menus com base no termo de busca
    const searchMenus = computed(() => {
      if (menuTerm.value.trim() === '') {
        return [];
      }

      const filteredMenus = menuList.value.filter((menu) =>
        menu.name.toLowerCase().includes(menuTerm.value.toLowerCase())
      );

      const alreadySelectedIds = new Set(categoryData.selectedMenu.map(menu => menu.id));

      return filteredMenus.filter(menu => !alreadySelectedIds.has(menu.id));
    });

    const addMenu = (menu) => {
      if (!categoryData.selectedMenu.find((item) => item.id === menu.id)) {
        categoryData.selectedMenu.push(menu);
      }
    };

    const removeMenu = (menu) => {
      if (!removedMenus.value.includes(menu.id)) {
        removedMenus.value.push(menu.id);
      }
      categoryData.selectedMenu = categoryData.selectedMenu.filter((item) => item.id !== menu.id);
    };

    const valid = (data) => {
      let isValid = true;
      for (const field in invalid) {
        if (
          (typeof data[field] === "string" && data[field] === "") ||
          (typeof data[field] === "object" && data[field].length === 0)
        ) {
          invalid[field] = true;
          isValid = false;
        } else {
          invalid[field] = false;
        }
      }
      return isValid;
    };

    const save = async () => {
      if (valid(categoryData)) {
        const selectedMenuIds = categoryData.selectedMenu.map(menu => menu.id);

        try {
          let response;
          if (isEditing.value) {
            // Atualiza a categoria
            response = await axios.put(
              `https://api.prattuapp.com.br/api/categoriesproduct/${props.selectedCategory.id}`,
              {
                name: categoryData.categoryName,
                menu_ids: selectedMenuIds,
              },
              {
                headers: {
                  Authorization: `Bearer ${store.state.token}`,
                  'Content-Type': 'application/json',
                },
              }
            );

            // Remove menus não mais selecionados
            for (const menuId of removedMenus.value) {
              await axios.delete(
                `https://api.prattuapp.com.br/api/categories/${props.selectedCategory.id}/menu/${menuId}`,
                {
                  headers: {
                    Authorization: `Bearer ${store.state.token}`,
                    'Content-Type': 'application/json',
                  },
                }
              );
            }

          } else {
            // Cria uma nova categoria
            response = await axios.post(
              'https://api.prattuapp.com.br/api/menus/add-category-to-menu',
              {
                name: categoryData.categoryName,
                menu_ids: selectedMenuIds,
                restaurant_id: store.state.restaurantId
              },
              {
                headers: {
                  Authorization: `Bearer ${store.state.token}`,
                  'Content-Type': 'application/json',
                },
              }
            );
          }

          await store.dispatch('fetchMenusAndItems');
          emit('categorySaved');
          emit('closeModal');
        } catch (error) {
          console.error('Erro ao salvar a categoria:', error.response ? error.response.data : error.message);
        }
      } else {
        console.error('Campos obrigatórios não preenchidos.');
      }
    };

    const deleteCategory = async () => {
      if (isEditing.value && props.selectedCategory) {
        try {
          await axios.delete(
            `https://api.prattuapp.com.br/api/categoriesproduct/${props.selectedCategory.id}`,
            {
              headers: {
                Authorization: `Bearer ${store.state.token}`,
                'Content-Type': 'application/json',
              },
            }
          );
          emit('categoryDeleted');
          await store.dispatch('fetchMenusAndItems');
          emit('closeModal'); // Fechar modal após exclusão
        } catch (error) {
          console.error('Erro ao deletar a categoria:', error.response ? error.response.data : error.message);
        }
      }
    };

    const resetCategoryData = () => {
      categoryData.categoryName = "";
      categoryData.selectedMenu = [];
      removedMenus.value = [];
    };

    watch(() => props.selectedCategory, (newVal) => {
      if (newVal) {
        categoryData.categoryName = newVal.name;
        categoryData.selectedMenu = newVal.menus.map(menu => {
          return { id: menu.id, name: menu.name };
        });
      } else {
        resetCategoryData();
      }
    }, { immediate: true });

    // Busca os menus quando o componente é montado
    onMounted(() => {
      fetchMenus();
    });

    return {
      menuList,
      menuTerm,
      searchMenus,
      categoryData,
      isEditing,
      addMenu,
      removeMenu,
      save,
      deleteCategory,
      resetCategoryData,
      invalid,
    };
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
  margin-bottom: 0;
  height: 43px;
}

.selected-menus {
  width: 100% !important;
  padding-top: 8px;
  position: relative;
  height: auto !important;
}

.selected-menus span {
  position: relative;
  white-space: nowrap;
  display: inline-block;
  background-color: #f0f0f0;
  margin: 0 10px 7px 0;
  font-size: 14px;
  padding: 7px 15px;
  border-radius: 20px;
}

.btn-remove-menu {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 15px;
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
  padding: 5px;
}
.button-group {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  width: 100%;

  .btn-save,
  .btn-danger {
    flex: 1;
  }
}

</style>
