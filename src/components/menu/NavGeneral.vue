<template>
  <div>
    <!-- Dropdown de Seleção de Menus -->
    <div class="row mb-2">
      <div class="col-6">
        <div class="dropdown">
          <button
            class="btn dropdown-toggle size-24 bold-700"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {{ selectedMenuName }}
          </button>
          <ul class="dropdown-menu">
            <li v-for="(menu, index) in menus" :key="menu.id">
              <a class="dropdown-item" href="#" @click="changeMenu(index)">
                {{ menu.name }}
              </a>
            </li>
          </ul>
        </div>
        <span class="opening-hours" @click="openOpeningHoursModal">
          <span class="text">{{ textOpeningHours }}</span>
          <span class="edit-data"></span>
        </span>
      </div>
      <div class="col-6 search-items">
        <input
          type="text"
          class="input-form search-term"
          placeholder="Buscar itens no cardápio"
          v-model="searchTerm"
        />
        <button type="button" class="btn btn-green btn-search">
          <span class="add-item add-inline icon-search"></span>
        </button>
      </div>
    </div>

    <!-- Botões de Criação de Novo Menu e Categoria -->
    <div class="row mb-3">
      <div class="col-12 create-new">
        <button @click="showModalFormMenu = true" type="button" class="btn new-menu">
          <span class="add-item add-inline add-black ml-1"></span> Criar novo cardápio
        </button>
        <button @click="showModalFormCategory = true" type="button" class="btn btn-green new-category">
          <span class="add-item add-inline add-black ml-1"></span> Adicionar categoria
        </button>
      </div>
    </div>

    <!-- Lista de Categorias -->
    <div v-if="filteredCategories.length > 0">
      <draggable
        v-model="sortableCategories"
        tag="div"
        itemKey="id"
        @end="onCategoryOrderChange"
      >
        <template #item="{ element: category, index }">
          <div
            class="table-data mb-5"
            v-show="category.items.length > 0 || searchTerm === ''"
          >
            <p class="bold-500">
              <span class="add-item add-inline icon-drag ml-1"></span>
              {{ category.name }}
            </p>
            <hr />
            <span class="btn-add-item" @click="openAddItemModal(category.id)">
              <span class="add-item add-inline add-black ml-1"></span>
              Clique aqui para adicionar um novo item
            </span>
            <hr />
            <div v-if="category.items.length > 0">
              <draggable v-model="category.items" tag="div" itemKey="id">
                <template #item="{ element: itemId }">
                  <div>
                    <div class="row table-row">
                      <div class="col-6">
                        <span class="add-item add-inline icon-drag ml-1"></span>
                        <img
                          v-if="items[itemId].image"
                          :src="items[itemId].image"
                          class="thumb-table"
                        />
                        <img
                          v-else
                          src="~@/assets/img/img.svg"
                          class="thumb-table"
                        />
                        {{ items[itemId].name }}
                      </div>
                      <div class="col-6 table-actions">
                        <label class="switch ml-1">
                          <input
                            type="checkbox"
                            v-model="items[itemId].active"
                            @change="toggleAvailability(items[itemId])"
                          />
                          <span class="slider round"></span>
                        </label>
                        <button
                          class="btn btn-round input-base edit-button"
                          @click="openItemModal(itemId, category.id)"
                        >
                          <span class="edit-data"></span>
                          <span class="text">Editar</span>
                        </button>
                      </div>
                    </div>
                    <hr />
                  </div>
                </template>
              </draggable>
            </div>
          </div>
        </template>
      </draggable>
    </div>

    <!-- Itens de Cross-Sell -->
    <div class="table-data mb-5">
      <p>
        <span class="add-item add-inline icon-drag ml-1"></span>
        <span class="bold-500 text-red ml-1">Itens de cross-sell</span>
        <span class="hint">
          Adicione itens que serão mostrados como sugestões aos seus clientes
          quando eles estiverem finalizando a compra
        </span>
      </p>
      <hr />
      <span class="btn-add-item" @click="openCrossSellItemModal">
        <span class="add-item add-inline add-black ml-1"></span>
        Clique aqui para adicionar um novo item
      </span>
      <hr />
      <div v-if="filteredCrossSellItems.length">
        <draggable v-model="filteredCrossSellItems" tag="div" itemKey="id">
          <template #item="{ element: itemId }">
            <div>
              <div class="row table-row">
                <div class="col-6">
                  <span class="add-item add-inline icon-drag ml-1"></span>
                  <img
                    v-if="items[itemId].image"
                    :src="items[itemId].image"
                    class="thumb-table"
                  />
                  <img
                    v-else
                    src="~@/assets/img/img.svg"
                    class="thumb-table"
                  />
                  {{ items[itemId].name }}
                </div>
                <div class="col-6 table-actions">
                  <label class="switch ml-1">
                    <input
                      type="checkbox"
                      v-model="items[itemId].active"
                      @change="toggleAvailability(items[itemId])"
                    />
                    <span class="slider round"></span>
                  </label>
                  <button
                    class="btn btn-round input-base edit-button"
                    @click="openItemModal(itemId, null, true)"
                  >
                    <span class="edit-data"></span>
                    <span class="text">Editar</span>
                  </button>
                </div>
              </div>
              <hr />
            </div>
          </template>
        </draggable>
      </div>
    </div>

    <!-- Botão de Deletar Menu -->
    <div class="row mt-4 alinhado-direita">
      <div class="col-12 text-center ">
        <button @click="showDeleteMenuModal = true" type="button" class="btn excluir">
          Excluir cardápio
        </button>
      </div>
    </div>

    <!-- Modals -->
    <Teleport to="body">
      <ModalFormMenu
        :show="showModalFormMenu"
        @close="showModalFormMenu = false"
      >
        <template #header>Novo cardápio</template>
        <template #body>
          <FormMenu
            @close-modal="showModalFormMenu = false"
            @save-menu-name="saveMenuName"
          />
        </template>
      </ModalFormMenu>
      <ModalFormCategory
        :show="showModalFormCategory"
        @close="showModalFormCategory = false"
        :selectedMenuIndex="selectedMenuIndex"
        :dataMenu="menus"
      >
        <template #header>Nova categoria</template>
        <template #body>
          <FormCategory
            @close-modal="showModalFormCategory = false"
            @save-category="saveCategory"
            :dataMenu="menus"
            :selectedMenuIndex="selectedMenuIndex"
          />
        </template>
      </ModalFormCategory>
      <ModalFormAddItem
        :show="showModalFormAddItem"
        @close="showModalFormAddItem = false"
        :category-id="selectedCategoryId"
      >
        <template #header>Adicionar item</template>
        <template #body>
          <FormAddItem
            @close-modal="showModalFormAddItem = false"
            @new-item="showModalFormItem = true"
            @search-item="openSearchItemModal"
          />
        </template>
      </ModalFormAddItem>
      <ModalFormSearchItem
        :show="showModalFormSearchItem"
        @close="showModalFormSearchItem = false"
        :category-id="selectedCategoryId"
      >
        <template #header>Buscar item</template>
        <template #body>
          <FormSearchItem
            @close-modal="showModalFormSearchItem = false"
            @save-item="saveItem"
            :categoryId="selectedCategoryId"
          />
        </template>
      </ModalFormSearchItem>
      <ModalFormItem
        :show="showModalFormItem"
        @close="showModalFormItem = false"
        :selected-category-id="selectedCategoryId" 
        ref="formItem"
      >
        <template #header>Novo item</template>
        <template #body>
          <FormItem
            @close-modal="showModalFormItem = false"
            @save-item="saveItem"
            :allCategories="allCategories"
            :allComplement="allComplement"
            :selectedCategoryId="selectedCategoryId"
            :itemEditData="itemData"
              
          />
        </template>
      </ModalFormItem>
      <ModalFormOpeningHours
        :show="showModalFormOpeningHours"
        @close="showModalFormOpeningHours = false"
        :selectedMenuIndex="selectedMenuIndex"
      >
        <template #header>Editar horário de funcionamento</template>
        <template #body>
          <FormOpeningHours
            @close-modal="showModalFormOpeningHours = false"
            @save-opening-hours="saveOpeningHours"
            :selectedMenuIndex="selectedMenuIndex"
          />
        </template>
      </ModalFormOpeningHours>

      <!-- Modal de Confirmação de Exclusão -->
      <ModalFormMenu
        :show="showDeleteMenuModal"
        @close="showDeleteMenuModal = false"
      >
        <template #header>Excluir cardápio</template>
       
          <template #body>
  <div class="container-data small-data" style="width: 550px;">
    <p style=" margin-bottom: 35px !important; font-weight: bold;">Certeza de que deseja excluir este cardápio? Essa ação é irreversível.</p>
    <div class="d-flex justify-content-between mt-2" style="gap: 20px;">
      <button @click.prevent="showDeleteMenuModal = false" type="button" class="btn btn-outline-success" style="flex: 1;">Cancelar</button>
      <button @click.prevent="deleteMenu" type="button" class="btn btn-danger" style="flex: 1;">Excluir</button>
     
    </div>
  </div>
</template>


      </ModalFormMenu>
    </Teleport>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import axios from 'axios';
import draggable from 'vuedraggable';
import ModalFormMenu from "../ModalBase.vue";
import ModalFormCategory from "../ModalBase.vue";
import ModalFormAddItem from "../ModalBase.vue";
import ModalFormSearchItem from "../ModalBase.vue";
import ModalFormItem from "../ModalBase.vue";
import ModalFormOpeningHours from "../ModalBase.vue";
import FormMenu from "./FormMenu.vue";
import FormCategory from "./FormCategory.vue";
import FormAddItem from "./FormAddItem.vue";
import FormSearchItem from "./FormSearchItem.vue";
import FormItem from "./FormItem3.vue";
import FormOpeningHours from "./FormOpeningHours.vue";

export default {
  name: "NavGeneral",
  components: {
    draggable,
    ModalFormMenu,
    ModalFormCategory,
    ModalFormAddItem,
    ModalFormSearchItem,
    ModalFormItem,
    ModalFormOpeningHours,
    FormMenu,
    FormCategory,
    FormAddItem,
    FormSearchItem,
    FormItem,
    FormOpeningHours,
  },
  data() {
    return {
      selectedMenuIndex: 0,
      selectedCategoryId: null,
      searchTerm: "",
      selectedMenuName: "",
      textOpeningHours: "Definir horário disponível",
      itemData: {},
      showModalFormMenu: false,
      showModalFormCategory: false,
      showModalFormAddItem: false,
      showModalFormSearchItem: false,
      showModalFormItem: false,
      showModalFormOpeningHours: false,
      showDeleteMenuModal: false, // Modal de exclusão
      sortableCategories: [] // Variável que será usada no draggable
    };
  },
  computed: {
    ...mapState(["menus", "items", "crossSellItems"]),
    filteredCategories() {
      if (this.menus[this.selectedMenuIndex]) {
        return this.menus[this.selectedMenuIndex].categories.map(category => ({
          ...category,
          items: category.items.filter(itemId =>
            this.items[itemId].name.toLowerCase().includes(this.searchTerm.toLowerCase())
          )
        })).sort((a, b) => a.order - b.order);
      }
      return [];
    },
    filteredCrossSellItems() {
      if (this.searchTerm === "") {
        return this.crossSellItems.map(item => item.id);
      }
      return this.crossSellItems
        .filter(item => item.name.toLowerCase().includes(this.searchTerm.toLowerCase()))
        .map(item => item.id);
    },
    formattedOpeningHours() {
      const daysOfWeek = [
        "Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado",
      ];

      const openingHours = this.menus[this.selectedMenuIndex]?.opening_hours || [];

      if (openingHours.length === 0) {
        return "Definir horário disponível";
      }

      const hoursMap = openingHours.reduce((acc, curr) => {
        const key = `${curr.start_time}-${curr.end_time}-${curr.is_closed}`;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(curr.day);
        return acc;
      }, {});

      const formattedHours = Object.entries(hoursMap).map(([time, days]) => {
        const [start_time, end_time, is_closed] = time.split("-");

        if (is_closed === "true") return null;

        const dayRanges = this.formatDayRanges(days, daysOfWeek);
        const formattedTime = `${this.formatTime(start_time)} às ${this.formatTime(end_time)}`;

        return `${dayRanges} - ${formattedTime}`;
      }).filter(Boolean);

      return formattedHours.join(". ");
    },
  },
  methods: {
    changeMenu(index) {
      this.selectedMenuIndex = index;
      this.selectedMenuName = this.menus[index].name;
      this.updateOpeningHoursText();
      this.syncSortableCategories(); // Sincroniza `sortableCategories` ao mudar de menu
    },
    updateOpeningHoursText() {
      this.textOpeningHours = this.formattedOpeningHours;
    },
    selectCategory(categoryId) {
      this.selectedCategoryId = categoryId;
    },
    selectItem(itemId, crossSell) {
      this.itemData = crossSell
        ? this.crossSellItems.find(item => item.id === itemId)
        : this.items[itemId];
    },
    toggleAvailability(item) {
      axios.patch(
        `https://api.prattuapp.com.br/api/products/${item.id}/availability`,
        { is_available: item.active },
        {
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`,
            "Content-Type": "application/json",
          },
        }
      ).catch(error => {
        console.error("Erro ao alterar disponibilidade:", error);
      });
    },
    formatDayRanges(days, daysOfWeek) {
      days = days.map(day => (day === 0 ? 7 : day));

      days.sort((a, b) => a - b);

      const ranges = [];
      let rangeStart = days[0];

      for (let i = 1; i <= days.length; i++) {
        if (days[i] !== days[i - 1] + 1) {
          const rangeEnd = days[i - 1];
          if (rangeStart === rangeEnd) {
            ranges.push(daysOfWeek[rangeStart - 1]);
          } else {
            ranges.push(`${daysOfWeek[rangeStart - 1]} à ${daysOfWeek[rangeEnd - 1]}`);
          }
          rangeStart = days[i];
        }
      }

      return ranges.join(", ");
    },
    formatTime(timeString) {
      return timeString.slice(0, 5);
    },
    openAddItemModal(categoryId) {
      this.selectedCategoryId = categoryId;
      this.showModalFormAddItem = true;
    },
    openSearchItemModal() {
      this.showModalFormSearchItem = true;
    },
    openItemModal(itemId, categoryId, isCrossSell = false) {
      this.selectCategory(categoryId);
      this.selectItem(itemId, isCrossSell);
      this.showModalFormItem = true;
    },
    openOpeningHoursModal() {
      this.showModalFormOpeningHours = true;
    },
    syncSortableCategories() {
      // Sincroniza `sortableCategories` com `filteredCategories`
      this.sortableCategories = [...this.filteredCategories];
    },
    async onCategoryOrderChange() {
      try {
        // Atualiza a ordem das categorias no estado local
        this.sortableCategories.forEach((category, index) => {
          category.order = index + 1;
        });

        // Prepara os dados da requisição
        const requestData = {
          menu_id: this.menus[this.selectedMenuIndex].id,
          order: this.sortableCategories.map(category => ({
            id: category.id,
            order: category.order,
          })),
        };

        // Envia a nova ordem para o backend
        await axios.post(
          "https://api.prattuapp.com.br/api/update-category-order",
          requestData,
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Atualiza o estado Vuex após a confirmação do backend
        this.$store.commit("setMenusAndItems", {
          menus: this.menus.map((menu, index) =>
            index === this.selectedMenuIndex
              ? { ...menu, categories: this.sortableCategories }
              : menu
          ),
          items: this.items,
          crossSellItems: this.crossSellItems,
        });
      } catch (error) {
        console.error("Erro ao atualizar a ordem das categorias:", error.response ? error.response.data : error.message);
      }
    },
    async deleteMenu() {
      try {
        const menuId = this.menus[this.selectedMenuIndex].id;
        await axios.delete(`https://api.prattuapp.com.br/api/menus/${menuId}`, {
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`,
          },
        });

        // Após a exclusão, remova o menu da lista e feche o modal
        this.menus.splice(this.selectedMenuIndex, 1);
        this.showDeleteMenuModal = false;

        // Se ainda houver menus, selecione o primeiro, senão redefina a seleção
        if (this.menus.length > 0) {
          this.selectedMenuIndex = 0;
          this.selectedMenuName = this.menus[0].name;
        } else {
          this.selectedMenuIndex = null;
          this.selectedMenuName = "";
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });

      } catch (error) {
        console.error("Erro ao excluir o menu:", error.response ? error.response.data : error.message);
      }
    },
  },
  watch: {
    menus: {
      immediate: true,
      handler(newMenus) {
        if (newMenus.length > 0) {
          this.selectedMenuIndex = 0;
          this.selectedMenuName = newMenus[0].name;
          this.syncSortableCategories(); // Inicializa `sortableCategories` ao montar o componente
          this.updateOpeningHoursText();
        }
      }
    },
    filteredCategories: {
      handler(newFilteredCategories) {
        this.syncSortableCategories(); // Atualiza `sortableCategories` sempre que `filteredCategories` mudar
      },
      deep: true,
    }
  },
  mounted() {
    if (this.menus.length > 0) {
      this.selectedMenuIndex = 0;
      this.selectedMenuName = this.menus[this.selectedMenuIndex]?.name || "";
      this.syncSortableCategories(); // Inicializa `sortableCategories` ao montar o componente
      this.updateOpeningHoursText();
    }
  },
};
</script>


<style lang="scss" scoped>
.search-items {
  text-align: right;
  .search-term {
    width: calc(100% - 150px);
    margin-right: 20px;
    padding-right: 20px;
    padding-left: 20px;
  }
  .btn-search .icon-search {
    margin-left: 8px;
    margin-right: 8px;
  }
}

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

.dropdown-toggle::after {
  color: $light-green;
  font-size: 20px;
}

.dropdown {
  display: inline-block;
  margin-right: 18px;
}

.opening-hours {
  position: relative;
}

.opening-hours::first-letter {
  text-transform: uppercase;
}

.opening-hours .edit-data {
  top: 3px;
  left: 7px;
}

.switch {
  top: -5px;
}

.table-data hr {
  margin: 18px 0;
}

.table-row {
  margin-top: 0px !important;
  margin-bottom: 0px;
}

.table-actions {
  padding-top: 8px;
  text-align: right;
}

.btn-add-item,
.opening-hours {
  cursor: pointer;
}
.alinhado-direita{
  align-items: right !important;
  align-content: right !important;
}
.excluir{
color: red !important;
text-decoration: underline;
}
.btn-outline-success{
 border-color: #18E21C !important;
 color: black !important;
 
}
.btn-outline-success:hover{
  background-color: white !important;
}
</style>
