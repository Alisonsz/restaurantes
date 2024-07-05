<template>
    <div>
      <div class="row mb-2">
        <div class="col-6">
          <div class="dropdown">
            <button class="btn dropdown-toggle size-24 bold-700" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              {{ selectedMenuName }}
            </button>
            <ul class="dropdown-menu">
              <li v-for="(menu, index) in dataGeneral" :key="index">
                <a class="dropdown-item" href="#" @click="changeMenu(index)">{{ menu.name }}</a>
              </li>
            </ul>
          </div>
          <span class="opening-hours" @click="showModal('openingHours')">
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
          <button @click="showModal('menu')" type="button" class="btn new-menu">
            <span class="add-item add-inline add-black ml-1"></span> Criar novo cardápio
          </button>
          <button @click="showModal('category')" type="button" class="btn btn-green new-category">
            <span class="add-item add-inline add-black ml-1"></span> Adicionar categoria
          </button>
        </div>
      </div>
      <div v-if="Object.keys(searchDataMenus).length > 0">
        <draggable v-model="searchDataMenus" tag="div">
          <template #item="{ element: category, index }">
            <div class="table-data mb-5" v-show="Object.keys(category.items).length > 0 || searchTerm === ''">
              <p class="bold-500"><span class="add-item add-inline icon-drag ml-1"></span> {{ category.name }}</p>
              <hr/>
              <span class="btn-add-item" @click="showModal('addItem'); selectCategory(index); selectItem(false, false)">
                <span class="add-item add-inline add-black ml-1"></span>Clique aqui para adicionar um novo item
              </span>
              <hr/>
              <div v-if="Object.keys(category.items).length > 0">
                <draggable v-model="category.items" tag="div">
                  <template #item="{ element: item }">
                    <div>
                      <div class="row table-row">
                        <div class="col-6">
                          <span class="add-item add-inline icon-drag ml-1"></span>
                          <img v-if="typeof allItems[item].image === 'string' && allItems[item].image !== ''" :src="allItems[item].image" class="thumb-table">
                          <img v-else src="~@/assets/img/img.svg" class="thumb-table">
                          {{ allItems[item].name }}
                        </div>
                        <div class="col-6 table-actions">
                          <label class="switch ml-1">
                            <input type="checkbox" v-model="allItems[item].active">
                            <span class="slider round"></span>
                          </label>
                          <button class="btn btn-round input-base edit-button" @click="showModal('editItem'); selectCategory(index); selectItem(item, false)">
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
      <!-- Itens de Cross-sell -->
      <div class="table-data mb-5">
        <p>
          <span class="add-item add-inline icon-drag ml-1"></span> 
          <span class="bold-500 text-red ml-1">Itens de cross-sell</span>
          <span class="hint">Adicione itens que serão mostrados como sugestões aos seus clientes quando eles estiverem finalizando a compra</span>
        </p>
        <hr/>
        <span class="btn-add-item" @click="showModal('addItem'); selectItem(false, true)">
          <span class="add-item add-inline add-black ml-1"></span>Clique aqui para adicionar um novo item
        </span>
        <hr/>
        <div v-if="Object.keys(searchDataCross).length">
          <draggable v-model="searchDataCross" tag="div">
            <template #item="{ element: item }">
              <div>
                <div class="row table-row">
                  <div class="col-6">
                    <span class="add-item add-inline icon-drag ml-1"></span>
                    <img v-if="typeof allItems[item].image === 'string' && allItems[item].image !== ''" :src="allItems[item].image" class="thumb-table">
                    <img v-else src="~@/assets/img/img.svg" class="thumb-table">
                    {{ allItems[item].name }}
                  </div>
                  <div class="col-6 table-actions">
                    <label class="switch ml-1">
                      <input type="checkbox" v-model="allItems[item].active">
                      <span class="slider round"></span>
                    </label>
                    <button class="btn btn-round input-base edit-button" @click="showModal('editItem'); selectItem(item, true)">
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
        <ModalFormMenu :show="showModalFormMenu" @close="closeModal('menu')">
          <template #header>Novo cardápio</template>
          <template #body>
            <FormMenu @close-modal="closeModal('menu')" @save-menu-name="saveMenuName"/>
          </template>
        </ModalFormMenu>
        <ModalFormCategory :show="showModalFormCategory" @close="closeModal('category')">
          <template #header>Nova categoria</template>
          <template #body>
            <FormCategory @close-modal="closeModal('category')" @save-category="saveCategory" :dataMenu="dataGeneral" :selectedMenuIndex="selectedMenuIndex"/>
          </template>
        </ModalFormCategory>
        <ModalFormAddItem :show="showModalFormAddItem" @close="closeModal('addItem')">
          <template #header>Adicionar item</template>
          <template #body>
            <FormAddItem @close-modal="closeModal('addItem')" @new-item="showModal('editItem'); mountAllCategories()" @search-item="showModal('searchItem')"/>
          </template>
        </ModalFormAddItem>
        <ModalFormSearchItem :show="showModalFormSearchItem" @close="closeModal('searchItem')">
          <template #header>Buscar item</template>
          <template #body>
            <FormSearchItem @close-modal="closeModal('searchItem')" @save-item="saveItem" />
          </template>
        </ModalFormSearchItem>
        <ModalFormItem :show="showModalFormItem" @close="closeModal('editItem')">
          <template #header>Novo item</template>
          <template #body>
            <FormItem @close-modal="closeModal('editItem')" @save-item="saveItem" :allCategories="allCategories" :allComplement="allComplement" :setCategory="selectedCategoryName" :itemEditData="itemData"/>
          </template>
        </ModalFormItem>
        <ModalFormOpeningHours :show="showModalFormOpeningHours" @close="closeModal('openingHours')">
          <template #header>Editar horário de funcionamento</template>
          <template #body>
            <FormOpeningHours @close-modal="closeModal('openingHours')" @save-opening-hours="saveOpeningHours" :dataMenu="dataGeneral" :selectedMenuIndex="selectedMenuIndex" :openingEditData="openingData"/>
          </template>
        </ModalFormOpeningHours>
      </Teleport>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import axios from 'axios'
  import draggable from 'vuedraggable'
  import ModalFormMenu from "../ModalBase.vue"
  import ModalFormCategory from "../ModalBase.vue"
  import ModalFormAddItem from "../ModalBase.vue"
  import ModalFormSearchItem from "../ModalBase.vue"
  import ModalFormItem from "../ModalBase.vue"
  import ModalFormOpeningHours from "../ModalBase.vue"
  
  const showModalFormMenu = ref(false)
  const showModalFormCategory = ref(false)
  const showModalFormAddItem = ref(false)
  const showModalFormSearchItem = ref(false)
  const showModalFormItem = ref(false)
  const showModalFormOpeningHours = ref(false)
  
  const dataMenuList = ref([])
  const dataItemsList = ref([])
  const dataCrossList = ref([])
  const searchTerm = ref('')
  const dataGeneral = ref([])
  
  const selectedMenuIndex = ref(0)
  const selectedMenuName = ref("")
  const selectedCategoryIndex = ref("")
  const selectedCategoryName = ref("")
  const allCategories = ref([])
  const allComplement = ref([])
  const allItems = ref([])
  const itemData = ref({})
  const openingData = ref({})
  const textOpeningHours = ref("Definir horário disponível")
  const itemsCrossSell = ref([])
  
  const searchDataMenus = computed(() => {
    if (searchTerm.value === '') {
      return dataMenuList.value
    }
    return dataMenuList.value.map(dataMenu => {
      return {
        name: dataMenu.name,
        active: dataMenu.active,
        items: dataMenu.items.filter(itemIndex => {
          return dataItemsList.value[itemIndex].name.toLowerCase().includes(searchTerm.value)
        })
      }
    })
  })
  
  const searchDataCross = computed(() => {
    if (searchTerm.value === '') {
      return dataCrossList.value
    }
    return dataCrossList.value.filter(item => {
      if (dataItemsList.value[item].name.toLowerCase().includes(searchTerm.value)) {
        return item
      }
    })
  })
  
  const fetchData = async () => {
    try {
      const response = await axios.get('https://projetoclick.uploading.net.br/public/api/menus?restaurant_id=1', {
        headers: {
          Authorization: `Bearer 3|XjRorVOeQOmIE0tobq8OJDaXGJURPTudEQLoMpxI08290b45`
        }
      })
      dataGeneral.value = response.data.data || []
      if (dataGeneral.value.length > 0) {
        selectedMenuName.value = dataGeneral.value[0].name
        dataMenuList.value = dataGeneral.value[0].categories || []
      }
    } catch (error) {
      console.error('Erro ao buscar os menus:', error)
    }
  }
  
  const showModal = (modalName) => {
    switch (modalName) {
      case 'menu':
        showModalFormMenu.value = true
        break
      case 'category':
        showModalFormCategory.value = true
        break
      case 'addItem':
        showModalFormAddItem.value = true
        break
      case 'searchItem':
        showModalFormSearchItem.value = true
        break
      case 'editItem':
        showModalFormItem.value = true
        break
      case 'openingHours':
        showModalFormOpeningHours.value = true
        break
    }
  }
  
  const closeModal = (modalName) => {
    switch (modalName) {
      case 'menu':
        showModalFormMenu.value = false
        break
      case 'category':
        showModalFormCategory.value = false
        break
      case 'addItem':
        showModalFormAddItem.value = false
        break
      case 'searchItem':
        showModalFormSearchItem.value = false
        break
      case 'editItem':
        showModalFormItem.value = false
        break
      case 'openingHours':
        showModalFormOpeningHours.value = false
        break
    }
  }
  
  onMounted(() => {
    fetchData()
  })
  </script>
  
  <script>
  import FormMenu from "./FormMenu.vue"
  import FormCategory from "./FormCategory.vue"
  import FormAddItem from "./FormAddItem.vue"
  import FormSearchItem from "./FormSearchItem.vue"
  import FormItem from "./FormItem.vue"
  import FormOpeningHours from "./FormOpeningHours.vue"
  import { ref, computed } from 'vue'
  
  export default {
    name: "NavGeneral",
    setup() {
      const saveMenuName = (menuName) => {
        if (typeof menuName === "string" && menuName.trim() !== "") {
          changeMenu(dataGeneral.value.push({ name: menuName.trim(), categories: [] }) -1)
        }
      }
  
      const saveCategory = (categoryData) => {
        if (typeof categoryData.categoryName === "string" && categoryData.categoryName.trim() !== "") {
          dataGeneral.value[selectedMenuIndex.value].categories.push({name: categoryData.categoryName.trim(), items: [], active: true})
        }
      }
  
      const saveItem = (itemData, categoriesData) => {
        if (typeof itemData === "object") {
          let idItem
          if (typeof itemData.id == "number") {
            idItem = itemData.id
            allItems.value[itemData.id] = itemData
          } else {
            idItem = allItems.value.push(itemData) -1
            allItems.value[idItem]["id"] = idItem
          }
          if (typeof itemData.cross == "boolean" && itemData.cross) {
            if (!itemsCrossSell.value.includes(idItem)) {
              itemsCrossSell.value.push(idItem)
            }
          } else {
            if (!dataGeneral.value[selectedMenuIndex.value].categories[selectedCategoryIndex.value].items.includes(idItem)) {
              dataGeneral.value[selectedMenuIndex.value].categories[selectedCategoryIndex.value].items.push(idItem)
            }
          }
          if (typeof categoriesData === "object") {
            categoriesData.forEach((categoryData) => 
              dataGeneral.value.forEach((menu, idMenu) => {
                menu.categories.forEach((category, idCategory) => {
                  if (categoryData.name == category.name) {
                    if (!dataGeneral.value[idMenu].categories[idCategory].items.includes(idItem)) {
                      dataGeneral.value[idMenu].categories[idCategory].items.push(idItem)
                    }
                  }
                })
              })
            )
          }
        }
        selectedCategoryIndex.value = ""
        selectedCategoryName.value = ""
        itemData.value.cross = false
        dataItemsList.value = allItems.value
        dataCrossList.value = itemsCrossSell.value
      }
  
      const changeMenu = (index) => {
        selectedMenuIndex.value = index
        selectedMenuName.value = dataGeneral.value[index].name
        dataMenuList.value = dataGeneral.value[index].categories || []
        searchDataMenus.value = dataMenuList.value
      }
  
      const selectItem = (index, cross) => {
        if (typeof index == "number") {
          itemData.value = allItems.value[index]
          itemData.value['id'] = index
          itemData.value['cross'] = cross
        } else {
          itemData.value = {cross: cross}
        }
      }
  
      const selectCategory = (index) => {
        selectedCategoryIndex.value = index
        selectedCategoryName.value = dataGeneral.value[selectedMenuIndex.value].categories[index].name
      }
  
      const mountAllCategories = () => {
        var removeDuplicates = []
        if (Array.isArray(dataGeneral.value)) {
          dataGeneral.value.forEach((menu) => {
            menu.categories.forEach((category) => {
              removeDuplicates.push(category.name)
            })
          })
        }
        allCategories.value = removeDuplicates.filter((value, index, self) => {
          return self.indexOf(value) === index
        })
      }
  
      const saveOpeningHours = (openingEditData) => {
        openingData.value = openingEditData
        createTextOpeningHours()
      }
  
      const createTextOpeningHours = () => {
        var seq = true
        var last = ""
        var size = -1
        var text = ""
        var allDays = { 
          seg: "segunda", 
          ter: "terça", 
          qua: "quarta", 
          qui: "quinta", 
          sex: "sexta", 
          sab: "sábado", 
          dom: "domingo" 
        }
        if (typeof openingData.value === "object" && Object.keys(openingData.value).length > 0) {
          openingData.value.weekday.filter((dataDay, index) => { 
            if(dataDay.active) {
              size = size + 1
              if (last === "") {
                last = index
              } else {
                if (index > last +1) {
                  seq = false
                }
                last = index
              }
              return dataDay.day
            }
          }).filter((day, index) => { 
            if (index == 0) {
              text = text + allDays[day.day]
            } else {
              if (index == size) {
                text = text + (seq ? " à " : " e ") + allDays[day.day]
              } else {
                if (!seq) {
                  text = text + ", " + allDays[day.day]
                }
              }
            }
            textOpeningHours.value = text + " - " + openingData.value.startHour + " " + openingData.value.endHour
          })
        } else {
          textOpeningHours.value = "Definir horário disponível"
        }
        textOpeningHours.value = textOpeningHours.value.charAt(0).toUpperCase() + textOpeningHours.value.slice(1)
      }
  
      return {
        selectedMenuIndex,
        selectedMenuName,
        selectedCategoryIndex,
        selectedCategoryName,
        allCategories,
        allComplement,
        allItems,
        itemData,
        openingData,
        textOpeningHours,
        itemsCrossSell,
        dataGeneral,
        saveMenuName,
        saveCategory,
        saveItem,
        changeMenu,
        selectItem,
        selectCategory,
        mountAllCategories,
        saveOpeningHours,
        createTextOpeningHours
      }
    },
    components: {
      FormMenu,
      FormCategory,
      FormAddItem,
      FormSearchItem,
      FormItem,
      FormOpeningHours
    }
  }
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
  