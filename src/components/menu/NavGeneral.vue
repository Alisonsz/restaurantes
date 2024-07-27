<template>
  <div>
    <div class="row mb-2">
      <div class="col-6">
        <div class="dropdown">
          <button class="btn dropdown-toggle size-24 bold-700" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            {{ selectedMenuName }}
          </button>
          <ul class="dropdown-menu">
            <li v-for="(menu, index) in dataGeneral.menus" :key="index">
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
    <div v-if="currentMenuCategories.length > 0">
      <draggable v-model="currentMenuCategories" tag="div">
        <template #item="{ element: category, index }">
          <div class="table-data mb-5" v-show="category.products.length > 0 || searchTerm === ''">
            <p class="bold-500"><span class="add-item add-inline icon-drag ml-1"></span> {{ category.name }}</p>
            <hr/>
            <span class="btn-add-item" @click="showModalFormAddItem = true; selectCategory(index); selectItem(false)">
              <span class="add-item add-inline add-black ml-1"></span>Clique aqui para adicionar um novo item
            </span>
            <hr/>
            <div v-if="category.products.length > 0">
              <draggable v-model="category.products" tag="div">
                <template #item="{ element: item }">
                  <div>
                    <div class="row table-row">
                      <div class="col-6">
                        <span class="add-item add-inline icon-drag ml-1"></span>
                        <img v-if="item.products_photo" :src="item.products_photo" class="thumb-table">
                        <img v-else src="~@/assets/img/img.svg" class="thumb-table">
                        {{ item.name }}
                      </div>
                      <div class="col-6 table-actions">
                        <label class="switch ml-1">
                          <input type="checkbox" v-model="item.active">
                          <span class="slider round"></span>
                        </label>
                        <button class="btn btn-round input-base edit-button" @click="showModalFormItem = true; selectCategory(index); selectItem(item)">
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
      <div v-if="searchDataCross.length > 0">
        <draggable v-model="searchDataCross" tag="div">
          <template #item="{ element: item }">
            <div>
              <div class="row table-row">
                <div class="col-6">
                  <span class="add-item add-inline icon-drag ml-1"></span>
                  <img v-if="item.products_photo" :src="item.products_photo" class="thumb-table">
                  <img v-else src="~@/assets/img/img.svg" class="thumb-table">
                  {{ item.name }}
                </div>
                <div class="col-6 table-actions">
                  <label class="switch ml-1">
                    <input type="checkbox" v-model="item.active">
                    <span class="slider round"></span>
                  </label>
                  <button class="btn btn-round input-base edit-button" @click="showModalFormItem = true; selectItem(item, true)">
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
          <FormCategory @close-modal="showModalFormCategory = false" @save-category="saveCategory" :dataMenu="dataGeneral.menus" :selectedMenuIndex="selectedMenuIndex"/>
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
          <FormOpeningHours @close-modal="showModalFormOpeningHours = false" @save-opening-hours="saveOpeningHours" :dataMenu="dataGeneral.menus" :selectedMenuIndex="selectedMenuIndex" :openingEditData="openingData"/>
        </template>
      </ModalFormOpeningHours>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
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

const searchTerm = ref('');
const dataGeneral = ref({ menus: [], opening_hours: [] });

const selectedMenuIndex = ref(0);
const selectedMenuName = ref("");
const selectedCategoryIndex = ref("");
const selectedCategoryName = ref("");
const allCategories = ref([]);
const allComplement = ref([]);
const allItems = ref([]);
const itemData = ref({});
const openingData = ref({});
const textOpeningHours = ref("Definir horário disponível");
const itemsCrossSell = ref([]);

const currentMenuCategories = computed(() => {
  if (!dataGeneral.value.menus || dataGeneral.value.menus.length === 0) return [];
  if (!dataGeneral.value.menus[selectedMenuIndex.value]) return [];
  if (searchTerm.value === '') {
    return dataGeneral.value.menus[selectedMenuIndex.value].categories;
  }
  return dataGeneral.value.menus[selectedMenuIndex.value].categories.map(category => {
    return {
      ...category,
      products: category.products.filter(product => product.name.toLowerCase().includes(searchTerm.value.toLowerCase()))
    };
  }).filter(category => category.products.length > 0);
});

const searchDataCross = computed(() => {
  if (searchTerm.value === '') {
    return itemsCrossSell.value;
  }
  return itemsCrossSell.value.filter(item => item.name.toLowerCase().includes(searchTerm.value.toLowerCase()));
});

const fetchData = async () => {
  try {
    console.log('Fetching user data...');
    const userResponse = await axios.get('https://api.prattuapp.com.br/api/users/me', {
      headers: {
        Authorization: `Bearer ${this.$store.state.token}`
      }
    });
    console.log('User data:', userResponse.data);
    const restaurantId = userResponse.data.restaurant_id;

    console.log('Fetching restaurant data...');
    const response = await axios.get(`https://api.prattuapp.com.br/api/restaurants/${restaurantId}/detailed`, {
      headers: {
        Authorization: `Bearer ${this.$store.state.token}`
      }
    });
    console.log('Restaurant data:', response.data);
    dataGeneral.value = response.data;
    if (dataGeneral.value.menus.length > 0) {
      selectedMenuName.value = dataGeneral.value.menus[0].name;
      selectedMenuIndex.value = 0;
    }
  } catch (error) {
    console.error('Erro ao buscar os dados do restaurante:', error);
  }
};

const showModal = (modalName) => {
  switch (modalName) {
    case 'menu':
      showModalFormMenu.value = true;
      break;
    case 'category':
      showModalFormCategory.value = true;
      break;
    case 'addItem':
      showModalFormAddItem.value = true;
      break;
    case 'searchItem':
      showModalFormSearchItem.value = true;
      break;
    case 'editItem':
      showModalFormItem.value = true;
      break;
    case 'openingHours':
      showModalFormOpeningHours.value = true;
      break;
  }
};

const closeModal = (modalName) => {
  switch (modalName) {
    case 'menu':
      showModalFormMenu.value = false;
      break;
    case 'category':
      showModalFormCategory.value = false;
      break;
    case 'addItem':
      showModalFormAddItem.value = false;
      break;
    case 'searchItem':
      showModalFormSearchItem.value = false;
      break;
    case 'editItem':
      showModalFormItem.value = false;
      break;
    case 'openingHours':
      showModalFormOpeningHours.value = false;
      break;
  }
};

const saveMenuName = (menuName) => {
  if (typeof menuName === "string" && menuName.trim() !== "") {
    dataGeneral.value.menus.push({ name: menuName.trim(), categories: [] });
    changeMenu(dataGeneral.value.menus.length - 1);
  }
};

const saveCategory = (categoryData) => {
  if (typeof categoryData.categoryName === "string" && categoryData.categoryName.trim() !== "") {
    dataGeneral.value.menus[selectedMenuIndex.value].categories.push({
      name: categoryData.categoryName.trim(),
      products: [],
      active: true
    });
  }
};

const saveItem = (itemData, categoriesData) => {
  if (typeof itemData === "object") {
    let idItem;
    if (typeof itemData.id == "number") {
      idItem = itemData.id;
      allItems.value[itemData.id] = itemData;
    } else {
      idItem = allItems.value.push(itemData) - 1;
      allItems.value[idItem]["id"] = idItem;
    }
    if (typeof itemData.cross == "boolean" && itemData.cross) {
      if (!itemsCrossSell.value.includes(idItem)) {
        itemsCrossSell.value.push(idItem);
      }
    } else {
      if (!dataGeneral.value.menus[selectedMenuIndex.value].categories[selectedCategoryIndex.value].products.includes(idItem)) {
        dataGeneral.value.menus[selectedMenuIndex.value].categories[selectedCategoryIndex.value].products.push(idItem);
      }
    }
    if (typeof categoriesData === "object") {
      categoriesData.forEach((categoryData) =>
        dataGeneral.value.menus.forEach((menu, idMenu) => {
          menu.categories.forEach((category, idCategory) => {
            if (categoryData.name == category.name) {
              if (!dataGeneral.value.menus[idMenu].categories[idCategory].products.includes(idItem)) {
                dataGeneral.value.menus[idMenu].categories[idCategory].products.push(idItem);
              }
            }
          })
        })
      );
    }
  }
  selectedCategoryIndex.value = "";
  selectedCategoryName.value = "";
  itemData.value.cross = false;
  allItems.value = allItems.value;
  itemsCrossSell.value = itemsCrossSell.value;
};

const changeMenu = (index) => {
  selectedMenuIndex.value = index;
  selectedMenuName.value = dataGeneral.value.menus[index].name;
};

const selectItem = (item, cross = false) => {
  if (item) {
    itemData.value = item;
    itemData.value['cross'] = cross;
  } else {
    itemData.value = { cross: cross };
  }
};

const selectCategory = (index) => {
  selectedCategoryIndex.value = index;
  selectedCategoryName.value = dataGeneral.value.menus[selectedMenuIndex.value].categories[index].name;
};

const mountAllCategories = () => {
  let removeDuplicates = [];
  if (Array.isArray(dataGeneral.value.menus)) {
    dataGeneral.value.menus.forEach((menu) => {
      menu.categories.forEach((category) => {
        removeDuplicates.push(category.name);
      });
    });
  }
  allCategories.value = removeDuplicates.filter((value, index, self) => {
    return self.indexOf(value) === index;
  });
};

const saveOpeningHours = (openingEditData) => {
  openingData.value = openingEditData;
  createTextOpeningHours();
};

const createTextOpeningHours = () => {
  let seq = true;
  let last = "";
  let size = -1;
  let text = "";
  const allDays = { seg: "segunda", ter: "terça", qua: "quarta", qui: "quinta", sex: "sexta", sab: "sábado", dom: "domingo" };
  if (typeof openingData.value === "object" && Object.keys(openingData.value).length > 0) {
    openingData.value.weekday.filter((dataDay, index) => {
      if (dataDay.active) {
        size = size + 1;
        if (last === "") {
          last = index;
        } else {
          if (index > last + 1) {
            seq = false;
          }
          last = index;
        }
        return dataDay.day;
      }
    }).filter((day, index) => {
      if (index == 0) {
        text = text + allDays[day.day];
      } else {
        if (index == size) {
          text = text + (seq ? " à " : " e ") + allDays[day.day];
        } else {
          if (!seq) {
            text = text + ", " + allDays[day.day];
          }
        }
      }
      textOpeningHours.value = text + " - " + openingData.value.startHour + " " + openingData.value.endHour;
    });
  } else {
    textOpeningHours.value = "Definir horário disponível";
  }
  textOpeningHours.value = textOpeningHours.value.charAt(0).toUpperCase() + textOpeningHours.value.slice(1);
};

onMounted(() => {
  fetchData();
});
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
