<template>
  <div>
    <div class="row mb-3 mt-3">
      <div class="col-4">
        <div class="input-group mb-3 item-filter">
          <input type="text" class="form-control input-form" placeholder="Buscar produto" v-model="itemTerm" />
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
        <button @click="showModalFormItem = true; resetForm()" type="button" class="btn btn-green new-category">
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
            <th scope="col"><span class="bold-500">Valor (R$)</span></th>
            <th scope="col"><span class="bold-500">Status</span></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in filteredItems" :key="index">
            <td class="bold-400">
              <img v-if="item.image" :src="item.image" class="thumb-table" />
              <img v-else :src="semImage" class="thumb-table" />
              {{ item.name }}
            </td>
            <td>{{ getMenuNameByItem(item.id) }}</td>
            <td>{{ formatCurrency(item.price) }}</td>
            <td class="item-actions">
              <label class="switch ml-1">
                <input type="checkbox" v-model="item.active" @change="toggleAvailability(item)" />
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
      <div v-if="filteredItems.length === 0">
        <p class="mt-4">Você ainda não adicionou nenhum item ao seu cardápio. Comece agora para atrair cada vez mais clientes!</p>
      </div>
    </div>
    <Pagination
      :pageNumber="currentPage"
      :pageRecords="itemsPerPage"
      :totalRecords="totalRecords"
      :setPageNumber="setCurrentPage"
      @selectPage="selectPage"
    />
    <Teleport to="body">
      <ModalFormItem :show="showModalFormItem" @close="showModalFormItem = false" @refreshItems="loadData">
        <template #header>{{ itemData.id ? 'Editar item' : 'Novo item' }}</template>
        <template #body>
          <FormItem 
            @close-modal="showModalFormItem = false" 
            @save-item="updateItemList" 
            :allCategories="allCategories" 
            :allComplement="allComplement" 
            :setCategory="''" 
            :itemEditData="itemData"
          />
        </template>
      </ModalFormItem>
    </Teleport>
  </div>


</template>

<script setup>
import { ref } from 'vue';
import ModalFormItem from "../ModalBase.vue";

const showModalFormItem = ref(false);
</script>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import FormItem from "./FormItem.vue";
import axios from 'axios';
import Pagination from '@/components/Pagination.vue';
import semImage from '@/assets/img/simboloverde.png';



export default {
  name: "NavItems",
  components: {
    FormItem,
    Pagination,
  },
  data() {
    return {
     

      itemData: {
        id: null,
        active: true,
        name: "",
        price: 0,
        image: "",
        description: "",
        complement: [],
      },
      formattedPrice: '',
      orderBy: "",
      itemTerm: '',
      currentPage: 1, 
      itemsPerPage: 20, 
    };
  },
  computed: {
    ...mapState({
      allItems: (state) => Object.values(state.items) || [],  // Garantindo que seja uma matriz
      allMenus: (state) => state.menus || [],  // Garantindo que seja uma matriz
      allCategories: (state) => state.categories || [],  // Garantindo que seja uma matriz
    }),
    filteredItems() {
      let itemsArray = this.allItems;

      if (this.itemTerm) {
        itemsArray = itemsArray.filter(item =>
          item.name.toLowerCase().includes(this.itemTerm.toLowerCase())
        );
      }

      switch (this.orderBy) {
        case "name":
          itemsArray = itemsArray.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "menu":
          itemsArray = itemsArray.sort((a, b) => this.getMenuNameByItem(a.id).localeCompare(this.getMenuNameByItem(b.id)));
          break;
        default:
          itemsArray = itemsArray.sort((a, b) => b.id - a.id);
          break;
      }

      return itemsArray.slice(this.startIndex, this.endIndex);
    },
    totalRecords() {
      return this.allItems.length;
    },
    startIndex() {
      return (this.currentPage - 1) * this.itemsPerPage;
    },
    endIndex() {
      return this.currentPage * this.itemsPerPage;
    }
  },
  methods: {
    ...mapActions(['fetchMenusAndItems']),
    ...mapMutations(['setMenusAndItems']),

    async loadData() {
      await this.fetchMenusAndItems();
    },
    
    updateItemList(savedItem) {
      const items = { ...this.$store.state.items };
      items[savedItem.id] = savedItem;
      this.setMenusAndItems({ menus: this.$store.state.menus, items, crossSellItems: this.$store.state.crossSellItems });
      this.showModalFormItem = false;
    },
    
    async fetchComplements() {
      const response = await axios.get(
        `https://api.prattuapp.com.br/api/components?restaurant_id=${this.$store.state.restaurantId}`,
        {
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`,
          },
        }
      );
      return response.data.data;
    },
    getMenuNameByItem(itemId) {
      for (const menu of this.allMenus) {
        for (const category of menu.categories) {
          if (category.items.includes(itemId)) {
            return menu.name;
          }
        }
      }
      return '';
    },
    selectItem(index) {
      this.itemData = this.filteredItems[index];
      this.formattedPrice = this.formatCurrency(this.itemData.price);
    },
    async toggleAvailability(item) {
      try {
        await axios.patch(
          `https://api.prattuapp.com.br/api/products/${item.id}/availability`,
          { is_available: item.active },
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        console.log(`Disponibilidade do item ${item.id} alterada para ${item.active}`);
      } catch (error) {
        console.error('Erro ao alterar disponibilidade:', error);
      }
    },
    resetForm() {
      this.itemData = {
        id: null,
        active: true,
        name: "",
        price: 0,
        image: "",
        description: "",
        complement: [],
      };
      this.formattedPrice = this.formatCurrency(0);
    },
    formatCurrency(value) {
      // Verifica se o valor é um número
      if (typeof value === 'number') {
        return value.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        });
      }
      return value;
    },
    parseCurrency(value) {
      if (typeof value === 'string') {
        return parseFloat(value.replace(/\D/g, '')) / 100;
      }
      return value;
    },
    orderList() {
      this.filteredItems;
    },
    setCurrentPage(page) {
      this.currentPage = page;
    },
    selectPage(page) {
      this.currentPage = page;
    }
  },
  watch: {
    'itemData.price': {
      immediate: true,
      handler(newValue) {
        this.formattedPrice = this.formatCurrency(newValue);
      }
    }
  },
  async mounted() {
    await this.loadData();
  },
};
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
