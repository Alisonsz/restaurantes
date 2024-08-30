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
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';

export default {
  name: "FormCategory",
  props: {
    selectedCategory: {
      type: Object,
      default: null,
    },
    dataMenu: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    let menuList = ref(props.dataMenu);
    const menuTerm = ref('');

    const isEditing = computed(() => props.selectedCategory !== null);

    const searchMenus = computed(() => {
      if (menuTerm.value.trim() === '') {
        return [];
      }
      return menuList.value.filter((menu) => {
        return menu.name.toLowerCase().includes(menuTerm.value.toLowerCase());
      });
    });

    return {
      menuList,
      menuTerm,
      searchMenus,
      isEditing,
      store,
    };
  },
  data() {
    return {
      invalid: {
        selectedMenu: false,
        categoryName: false,
      },
      categoryData: {
        selectedMenu: [],
        categoryName: "",
      },
      removedMenus: [], // Array para armazenar os menus que foram removidos
    };
  },
  watch: {
    selectedCategory: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          // Preencher o nome da categoria
          this.categoryData.categoryName = newVal.name;

          // Mapear os menus associados
          this.categoryData.selectedMenu = newVal.menus.map(menu => {
            const fullMenu = this.dataMenu.find(m => m.id === menu.id);
            return {
              id: fullMenu.id,
              name: fullMenu.name
            };
          });
        } else {
          this.categoryData.categoryName = ""; // Resetar campo
          this.categoryData.selectedMenu = []; // Resetar campo
        }
      }
    }
  },
  methods: {
    addMenu(menu) {
      if (!this.categoryData.selectedMenu.find((item) => item.id === menu.id)) {
        this.categoryData.selectedMenu.push(menu);
      }
    },
    removeMenu(menu) {
      // Adiciona o menu removido à lista de menus removidos
      this.removedMenus.push(menu.id);
      // Remove o menu da lista de menus selecionados
      this.categoryData.selectedMenu = this.categoryData.selectedMenu.filter((item) => item.id !== menu.id);
    },
    valid(data) {
      let isvalid = true;
      for (const field in this.invalid) {
        if (
          (typeof data[field] === "string" && data[field] === "") ||
          (typeof data[field] === "object" && data[field].length === 0)
        ) {
          this.invalid[field] = true;
          isvalid = false;
        } else {
          this.invalid[field] = false;
        }
      }
      return isvalid;
    },
    async save() {
      console.log('Salvando a categoria...');

      if (this.valid(this.categoryData)) {
        const selectedMenuIds = this.categoryData.selectedMenu.map(menu => menu.id);

        console.log('selectedMenuIds:', selectedMenuIds);
        console.log('Nome da categoria:', this.categoryData.categoryName);

        try {
          let response;
          if (this.isEditing) {
            // Editar a categoria existente
            response = await axios.put(
              `https://api.prattuapp.com.br/api/categoriesproduct/${this.selectedCategory.id}`,
              {
                name: this.categoryData.categoryName,
                menu_ids: selectedMenuIds,
              },
              {
                headers: {
                  Authorization: `Bearer ${this.store.state.token}`,
                  'Content-Type': 'application/json',
                },
              }
            );

            console.log('Resposta da API:', response.data);

            // Remover a categoria dos menus removidos
            for (const menuId of this.removedMenus) {
              await axios.delete(
                `https://api.prattuapp.com.br/api/categories/${this.selectedCategory.id}/menu/${menuId}`,
                {
                  headers: {
                    Authorization: `Bearer ${this.store.state.token}`,
                    'Content-Type': 'application/json',
                  },
                }
              );
              console.log(`Menu ${menuId} removido da categoria ${this.selectedCategory.id}`);
            }

          } else {
            // Criar nova categoria
            response = await axios.post(
              'https://api.prattuapp.com.br/api/menus/add-category-to-menu',
              {
                name: this.categoryData.categoryName,
                menu_ids: selectedMenuIds,
                restaurant_id: this.store.state.restaurantId
              },
              {
                headers: {
                  Authorization: `Bearer ${this.store.state.token}`,
                  'Content-Type': 'application/json',
                },
              }
            );

            console.log('Resposta da API:', response.data);
          }

          await this.store.dispatch('fetchMenusAndItems');
          this.$emit('closeModal');
        } catch (error) {
          console.error('Erro ao salvar a categoria:', error.response ? error.response.data : error.message);
        }
      } else {
        console.error('Campos obrigatórios não preenchidos.');
      }
    },
    async deleteCategory() {
      if (this.isEditing && this.selectedCategory) {
        try {
          await axios.delete(
            `https://api.prattuapp.com.br/api/categoriesproduct/${this.selectedCategory.id}`,
            {
              headers: {
                Authorization: `Bearer ${this.store.state.token}`,
                'Content-Type': 'application/json',
              },
            }
          );
          console.log('Categoria deletada com sucesso');
          await this.store.dispatch('fetchMenusAndItems');
          this.$emit('closeModal'); // Fechar modal após exclusão
        } catch (error) {
          console.error('Erro ao deletar a categoria:', error.response ? error.response.data : error.message);
        }
      }
    },
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
