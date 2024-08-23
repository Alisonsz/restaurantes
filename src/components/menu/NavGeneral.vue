<template>
  <div>
    <div class="row mb-2">
      <div class="col-6">
        <div class="dropdown">
          <button class="btn dropdown-toggle size-24 bold-700" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            {{ selectedMenuName }}
          </button>
          <ul class="dropdown-menu">
            <li v-for="(menu, index) in menus" :key="menu.id">
              <a class="dropdown-item" href="#" @click="changeMenu(index)">{{ menu.name }}</a>
            </li>
          </ul>
        </div>
        <span class="opening-hours" @click="showModalFormOpeningHours = true">
          <span class="text">{{ textOpeningHours }}</span> <span class="edit-data"></span>
        </span>
      </div>
      <div class="col-6 search-items">
        <input type="text" class="input-form search-term" placeholder="Buscar itens no cardápio" v-model="searchTerm">
        <button type="button" class="btn btn-green btn-search">
          <span class="add-item add-inline icon-search"></span>
        </button>
      </div>
    </div>
    <hr/>
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
    <div v-if="filteredCategories.length > 0">
      <draggable v-model="filteredCategories" tag="div">
        <template #item="{ element: category, index }">
          <div class="table-data mb-5" v-show="category.items.length > 0 || searchTerm === ''">
            <p class="bold-500"><span class="add-item add-inline icon-drag ml-1"></span> {{ category.name }}</p>
            <hr/>
            <span class="btn-add-item" @click="showModalFormAddItem = true; selectCategory(index); selectItem(false, false)">
              <span class="add-item add-inline add-black ml-1"></span>Clique aqui para adicionar um novo item
            </span>
            <hr/>
            <div v-if="category.items.length > 0">
              <draggable v-model="category.items" tag="div">
                <template #item="{ element: itemId }">
                  <div>
                    <div class="row table-row">
                      <div class="col-6">
                        <span class="add-item add-inline icon-drag ml-1"></span>
                        <img v-if="items[itemId].image" :src="items[itemId].image" class="thumb-table">
                        <img v-else src="~@/assets/img/img.svg" class="thumb-table">
                        {{ items[itemId].name }}
                      </div>
                      <div class="col-6 table-actions">
                        <label class="switch ml-1">
                          <input type="checkbox" v-model="items[itemId].active" @change="toggleAvailability(items[itemId])">
                          <span class="slider round"></span>
                        </label>
                        <button class="btn btn-round input-base edit-button" @click="showModalFormItem = true; selectCategory(index); selectItem(itemId, false)">
                          <span class="edit-data"></span> 
                          <span class="text">Editar</span>
                        </button>
                      </div>
                    </div>
                    <hr/>
                  </div>
                </template>
              </draggable>
            </div>
          </div>
        </template>
      </draggable>
    </div>
    <div class="table-data mb-5">
      <p>
        <span class="add-item add-inline icon-drag ml-1"></span> 
        <span class="bold-500 text-red ml-1">Itens de cross-sell</span>
        <span class="hint">Adicione itens que serão mostrados como sugestões aos seus clientes quando eles estiverem finalizando a compra</span>
      </p>
      <hr/>
      <span class="btn-add-item" @click="showModalFormAddItem = true; selectItem(false, true)">
        <span class="add-item add-inline add-black ml-1"></span>Clique aqui para adicionar um novo item
      </span>
      <hr/>
      <div v-if="filteredCrossSellItems.length">
        <draggable v-model="filteredCrossSellItems" tag="div">
          <template #item="{ element: itemId }">
            <div>
              <div class="row table-row">
                <div class="col-6">
                  <span class="add-item add-inline icon-drag ml-1"></span>
                  <img v-if="items[itemId].image" :src="items[itemId].image" class="thumb-table">
                  <img v-else src="~@/assets/img/img.svg" class="thumb-table">
                  {{ items[itemId].name }}
                </div>
                <div class="col-6 table-actions">
                  <label class="switch ml-1">
                    <input type="checkbox" v-model="items[itemId].active" @change="toggleAvailability(items[itemId])">
                    <span class="slider round"></span>
                  </label>
                  <button class="btn btn-round input-base edit-button" @click="showModalFormItem = true; selectItem(itemId, true)">
                    <span class="edit-data"></span> 
                    <span class="text">Editar</span>
                  </button>
                </div>
              </div>
              <hr/>
            </div>
          </template>
        </draggable>            
      </div>
    </div>
    <Teleport to="body">
      <ModalFormMenu :show="showModalFormMenu" @close="showModalFormMenu = false">
        <template #header>Novo cardápio</template>
        <template #body>
          <FormMenu @close-modal="showModalFormMenu = false" @save-menu-name="saveMenuName"/>
        </template>
      </ModalFormMenu>
      <ModalFormCategory :show="showModalFormCategory" @close="showModalFormCategory = false">
        <template #header>Nova categoria</template>
        <template #body>
          <FormCategory @close-modal="showModalFormCategory = false" @save-category="saveCategory" :dataMenu="dataGeneral" :selectedMenuIndex="selectedMenuIndex"/>
        </template>
      </ModalFormCategory>
      <ModalFormAddItem :show="showModalFormAddItem" @close="showModalFormAddItem = false">
        <template #header>Adicionar item</template>
        <template #body>
          <FormAddItem @close-modal="showModalFormAddItem = false" @new-item="showModalFormItem = true; mountAllCategories()" @search-item="showModalFormSearchItem = true"/>
        </template>
      </ModalFormAddItem>
      <ModalFormSearchItem :show="showModalFormSearchItem" @close="showModalFormSearchItem = false">
        <template #header>Buscar item</template>
        <template #body>
          <FormSearchItem @close-modal="showModalFormSearchItem = false" @save-item="saveItem" />
        </template>
      </ModalFormSearchItem>
      <ModalFormItem :show="showModalFormItem" @close="showModalFormItem = false">
        <template #header>Novo item</template>
        <template #body>
          <FormItem @close-modal="showModalFormItem = false" @save-item="saveItem" :allCategories="allCategories" :allComplement="allComplement" :setCategory="selectedCategoryName" :itemEditData="itemData"/>
        </template>
      </ModalFormItem>
      <ModalFormOpeningHours :show="showModalFormOpeningHours" @close="showModalFormOpeningHours = false">
        <template #header>Editar horário de funcionamento</template>
        <template #body>
          <FormOpeningHours @close-modal="showModalFormOpeningHours = false" @save-opening-hours="saveOpeningHours" :dataMenu="dataGeneral" :selectedMenuIndex="selectedMenuIndex" :openingEditData="openingData"/>
        </template>
      </ModalFormOpeningHours>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import draggable from 'vuedraggable';
import ModalFormMenu from "../ModalBase.vue";
import ModalFormCategory from "../ModalBase.vue";
import ModalFormAddItem from "../ModalBase.vue";
import ModalFormSearchItem from "../ModalBase.vue";
import ModalFormItem from "../ModalBase.vue";
import ModalFormOpeningHours from "../ModalBase.vue";

const showModalFormMenu = ref(false);
const showModalFormCategory = ref(false);
const showModalFormAddItem = ref(false);
const showModalFormSearchItem = ref(false);
const showModalFormItem = ref(false);
const showModalFormOpeningHours = ref(false);
</script>

<script>
import { mapState } from 'vuex';
import axios from 'axios';
import FormMenu from "./FormMenu.vue";
import FormCategory from "./FormCategory.vue";
import FormAddItem from "./FormAddItem.vue";
import FormSearchItem from "./FormSearchItem.vue";
import FormItem from "./FormItem.vue";
import FormOpeningHours from "./FormOpeningHours.vue";

export default {
  name: "NavGeneral",
  components: {
    FormMenu,
    FormCategory,
    FormAddItem,
    FormSearchItem,
    FormItem,
    FormOpeningHours
  },
  data() {
    return {
      selectedMenuIndex: 0,
      selectedCategoryIndex: "",
      searchTerm: "",
      selectedMenuName: "",
      textOpeningHours: "Definir horário disponível",
      itemData: {}
    };
  },
  computed: {
    ...mapState(['menus', 'items', 'crossSellItems']),
    filteredCategories() {
      const categories = this.menus[this.selectedMenuIndex]?.categories || [];
      if (this.searchTerm === '') {
        return categories;
      }
      return categories.map(category => ({
        ...category,
        items: category.items.filter(itemId => 
          this.items[itemId].name.toLowerCase().includes(this.searchTerm.toLowerCase())
        )
      }));
    },
    filteredCrossSellItems() {
      if (this.searchTerm === '') {
        return this.crossSellItems.map(item => item.id);
      }
      return this.crossSellItems
        .filter(item => item.name.toLowerCase().includes(this.searchTerm.toLowerCase()))
        .map(item => item.id);
    }
  },
  methods: {
    changeMenu(index) {
      this.selectedMenuIndex = index;
      this.selectedMenuName = this.menus[index].name;
      this.updateOpeningHoursText();
    },
    updateOpeningHoursText() {
      const openingHours = this.menus[this.selectedMenuIndex]?.opening_hours || [];
      if (openingHours.length === 0) {
        this.textOpeningHours = "Definir horário disponível";
        return;
      }
      // Implementar a lógica para formatar o texto de horário de funcionamento
    },
    selectCategory(index) {
      this.selectedCategoryIndex = index;
    },
    selectItem(itemId, crossSell) {
      this.itemData = crossSell 
        ? this.crossSellItems.find(item => item.id === itemId) 
        : this.items[itemId];
    },
    toggleAvailability(item) {
      try {
        axios.patch(
          `https://api.prattuapp.com.br/api/products/${item.id}/availability`,
          { is_available: item.active },
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.token}`,
              'Content-Type': 'application/json',
            },
          }
        ).then(() => {
          console.log(`Disponibilidade do item ${item.id} alterada para ${item.active}`);
        }).catch(error => {
          console.error('Erro ao alterar disponibilidade:', error);
        });
      } catch (error) {
        console.error('Erro ao tentar alterar disponibilidade:', error);
      }
    }
  },
  mounted() {
    this.selectedMenuName = this.menus[this.selectedMenuIndex]?.name || "";
    this.updateOpeningHoursText();
  }
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
    top: 8px;
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

  .btn-add-item, .opening-hours {
    cursor: pointer;
  }
</style>
