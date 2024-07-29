<template>
    <div>
      <div class="row mb-3 mt-3">
        <div class="col-4">
          <div class="input-group mb-3 item-filter">
            <input type="text" class="form-control input-form" placeholder="Buscar produto" v-model="itemTerm">
            <span class="input-group-text input-form" id="basic-addon1">
              <span class="add-item add-inline icon-search"></span>
            </span>
          </div>
        </div>
        <div class="col-4">
          <select class="form-select item-order input-form" v-model="orderBy" @change="orderList">
            <option value="">Organizar por</option>
            <option value="name">Nome</option>
            <option value="menu">Cardápio</option>
          </select>
        </div>
        <div class="col-4 create-new text-end">
          <button @click="showModalFormItem = true" type="button" class="btn btn-green new-category">
            <span class="add-item add-inline add-black ml-1"></span> Adicionar novo item
          </button>
        </div>
      </div>
      <div class="pb-4">
        <table class="table mt-3">
          <thead>
            <tr>
              <th scope="col"><span class="bold-500">Nome do produto</span></th>
              <th scope="col"><span class="bold-500">Cardápio</span></th>
              <th scope="col"><span class="bold-500">Valor</span></th>
              <th scope="col"><span class="bold-500">Status</span></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in searchItems" :key="index">
              <td class="bold-400">
                <img v-if="item.products_photo_url" :src="item.products_photo_url" class="thumb-table">
                <img v-else src="~@/assets/img/img.svg" class="thumb-table">
                {{ item.name }}
              </td>
              <td>{{ item.menus.join(', ') }}</td>
              <td>{{ item.price }}</td>
              <td class="item-actions">
                <label class="switch ml-1">
                  <input type="checkbox" v-model="item.active">
                  <span class="slider round"></span>
                </label>
                <button class="btn btn-round input-base edit-button" @click="showModalFormItem = true; selectItem(index)">
                  <span class="edit-data"></span>
                  <span class="text">Editar</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="searchItems.length === 0">
          <p class="mt-4">Você ainda não adicionou nenhum item ao seu cardápio. Comece agora para atrair cada vez mais clientes!</p>
        </div>
      </div>
      <Teleport to="body">
        <ModalFormItem :show="showModalFormItem" @close="showModalFormItem = false">
          <template #header>Novo item</template>
          <template #body>
            <FormItem @close-modal="showModalFormItem = false" @save-item="saveItem" :allCategories="allCategories" :allComplement="allComplement" :setCategory="''" :itemEditData="itemData"/>
          </template>
        </ModalFormItem>
      </Teleport>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useStore } from 'vuex'; // Importando o Vuex store
  import axios from 'axios';
  import ModalFormItem from "../ModalBase.vue";
  import FormItem from "./FormItem.vue";
  
  const showModalFormItem = ref(false);
  const itemTerm = ref('');
  const orderBy = ref('');
  const itemList = ref([]);
  const allCategories = ref([]);
  const allComplement = ref([]);
  const itemData = ref([]);
  
  // Computed para filtrar os itens de acordo com o termo de busca
  const searchItems = computed(() => {
    if (itemTerm.value === '') {
      return itemList.value;
    }
    return itemList.value.filter(item => item.name.toLowerCase().includes(itemTerm.value.toLowerCase()));
  });
  
  // Pega o store usando o Composition API
  const store = useStore();
  
  // Função para buscar o restaurant_id e os produtos
  const fetchRestaurantAndProducts = async () => {
    try {
      const userResponse = await axios.get('https://api.prattuapp.com.br/api/users/me', {
        headers: {
          Authorization: `Bearer ${store.state.token}` // Usando store.state.token
        }
      });
      const restaurantId = userResponse.data.restaurant_id;
      await fetchProducts(restaurantId);
    } catch (error) {
      console.error('Erro ao buscar dados do restaurante ou produtos:', error);
    }
  };
  
  // Função para buscar os produtos da API
  const fetchProducts = async (restaurantId) => {
    try {
      const response = await axios.get(`https://api.prattuapp.com.br/api/restaurants/${restaurantId}/products`, {
        headers: {
          Authorization: `Bearer ${store.state.token}` // Usando store.state.token
        }
      });
      itemList.value = response.data;
      console.log('Produtos:', response.data);
    } catch (error) {
      console.error('Erro ao buscar os produtos:', error);
    }
  };
  
  const selectItem = (index) => {
    itemData.value = itemList.value[index];
    itemData.value['id'] = index;
  };
  
  const orderList = () => {
    switch(orderBy.value) {
      case 'name':
        itemList.value.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'menu':
        itemList.value.sort((a, b) => a.menus[0]?.localeCompare(b.menus[0] || ''));
        break;
      default:
        break;
    }
  };
  
  // Inicializar dados na montagem do componente
  onMounted(() => {
    fetchRestaurantAndProducts();
  });
  </script>
  
  <style lang="scss" scoped>
  .create-new {
    text-align: right;
    .new-menu {
      border: 1px solid #ccc;
      margin-right: 20px;
    }
    button {
      padding-left: 20px;
      padding-right: 20px;
    }
  }
  
  .table-data .input-base {
    background-color: #e6f7ff;
    margin-left: 10px;
    padding-top: 9px !important;
    padding-bottom: 9px !important;
    white-space: nowrap;
  }
  
  .item-actions {
    width: 240px;
  }
  
  .item-filter .form-control {
    border-radius: 9px 0 0 9px !important;
  }
  .item-filter .input-group-text {
    border-radius: 0 9px 9px 0 !important;
  }
  .icon-search {
    margin-top: -5px;
  }
  
  .table thead span {
    display: block;
    padding-bottom: 10px;
  } 
  
  .table tbody td {
    vertical-align: middle;
    padding-top: 15px;
    padding-bottom: 15px;
  } 
  
  .table tbody td .switch {
    top: -3px !important;
  } 
  </style>
  