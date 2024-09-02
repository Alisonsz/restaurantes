<template>
  <div class="container-data">
    <form>
      <div class="row">
        <div class="col-lg-12 d-grid">
          <label class="form-label bold-500 mb-1">Nome</label>
          <input
            type="text"
            class="form-control"
            v-model="dataComplement.name"
            placeholder="Ex: Hamburguer"
            maxlength="50"
          />
          <p class="mb-0 mt-1 required-alert" v-show="invalid.name">
            *Campo obrigatório
          </p>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-lg-6 d-grid">
          <div class="w-full search-input">
            <label class="form-label bold-500 mb-1">Adicionar item</label>
            <input
              type="text"
              class="form-control"
              placeholder="Digite..."
              v-model="productTerm"
            />
            <ul
              v-if="searchProducts && searchProducts.length"
              class="w-full rounded search-list"
              role="list"
            >
              <li
                v-for="(product, index) in searchProducts"
                :key="index"
              >
                <span>{{ product.name }}</span>
                <span
                  role="button"
                  class="add-item add-right add-on"
                  @click="selectProduct(product), productTerm=''"
                ></span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="mt-3 pointer">
        <span role="button" @click="showModalFormItem = true">
          <span class="add-item add-inline add-black ml-1"></span>
          Clique aqui para criar e adicionar um novo item
        </span>
      </div>
      <div v-if="dataComplement.items && dataComplement.items.length">
        <draggable v-model="dataComplement.items" tag="div">
          <template #item="{ element: item, index }">
            <div
              class="list-item accordion mt-3"
              :id="('accordion-'+index)"
            >
              <div class="accordion-item">
                <h2 class="accordion-header" :id="'heading-'+index">
                  <span>
                    <span class="add-item add-inline icon-drag ml-1"></span>
                    {{ item.name }}
                  </span>
                  <span class="item-actions">
                    <span
                      class="item-price"
                      @click.prevent=""
                      >R$
                      <span v-if="item.price">{{ item.price }}</span>
                      <span v-else>0,00</span>
                    </span>
                    <div class="dropdown">
                      <span
                        class="dropdown-toggle add-item add-inline icon-options ml-1"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      ></span>
                      <ul class="dropdown-menu">
                        <li>
                          <a
                            class="dropdown-item"
                            href="#"
                            @click="editItem(index)"
                            >Editar</a
                          >
                        </li>
                        <li>
                          <a
                            class="dropdown-item"
                            href="#"
                            @click="removeItem(index)"
                            >Excluir</a
                          >
                        </li>
                       
                      </ul>
                    </div>
                  </span>
                </h2>
                <div
                  :id="('item-'+index)"
                  class="accordion-collapse collapse"
                  :aria-labelledby="'heading-'+index"
                  :data-bs-parent="('#item-'+index)"
                >
                  <div class="accordion-body">
                    <div v-if="item.items && item.items.length">
                      <draggable v-model="item.items" tag="div">
                        <template #item="{ element: subitem, i }">
                          <h2 class="accordion-header mt-2 list-subitem">
                            <span>
                              <span
                                class="add-item add-inline icon-drag ml-1"
                              ></span>
                              {{ subitem.name }}
                            </span>
                            <span class="item-actions">
                              <div class="dropdown">
                                <span
                                  class="dropdown-toggle add-item add-inline icon-options ml-1"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                ></span>
                                <ul class="dropdown-menu">
                                  <li>
                                    <a
                                      class="dropdown-item"
                                      href="#"
                                      @click="editSubItem(i, index)"
                                      >Editar</a
                                    >
                                  </li>
                                  <li>
                                    <a
                                      class="dropdown-item"
                                      href="#"
                                      @click="removeSubItem(i, index)"
                                      >Excluir</a
                                    >
                                  </li>
                                </ul>
                              </div>
                            </span>
                          </h2>
                        </template>
                      </draggable>
                    </div>
                    <div class="bold-500" v-else>
                      <span class="mt-3 mb-3">Não há subitens cadastrados.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </draggable>
      </div>
      <div class="rules">
        <h2>Regras de uso</h2>
        <p class="hint">Defina as regras de seleção de complementos para os seus clientes.</p>
        <hr />
        <p class="text">
          A seleção de pelo menos um item é obrigatória?
          <label class="switch-yn ml-1">
            <input type="checkbox" v-model="dataComplement.selectOne" @change="toggleRequiredSelection"/>
            <span class="slider round"></span>
          </label>
        </p>
        <p class="text">Até quantos itens diferentes o usuário pode selecionar?</p>
        <input
          type="number"
          class="form-control number"
          v-model="dataComplement.selectNumber"
          @input="validateNumber('selectNumber')"
        />
        <p class="text">
          O usuário pode selecionar um item mais de uma vez?
          <label class="switch-yn ml-1">
            <input type="checkbox" v-model="dataComplement.selectMore" />
            <span class="slider round"></span>
          </label>
        </p>
        <div v-show="dataComplement.selectMore">
          <p class="text">Até quantas vezes?</p>
          <input
            type="number"
            class="form-control number"
            v-model="dataComplement.moreNumber"
            @input="validateNumber('moreNumber')"
          />
        </div>
      </div>
    </form>
    <div class="row mb-3 mt-4 modal-footer">
      <div class="col-lg-2 d-grid gap-2">
        <button
          v-if="dataComplement.id"
          @click.prevent="deleteComponent"
          type="button"
          class="btn btn-danger"
        >
          Excluir
        </button>
      </div>
      <div class="col-lg-2 d-grid gap-2">
        <button
          @click.prevent="save"
          type="submit"
          class="btn btn-save"
        >
          Salvar
        </button>
      </div>
      
    </div>
    <Teleport to="body">
      <ModalFormAddItem
        :show="showModalFormAddItem"
        @close="showModalFormAddItem = false"
      >
        <template #header>Adicionar item</template>
        <template #body>
          <FormAddItem
            @close-modal="showModalFormAddItem = false"
            @new-item="showModalFormItem = true"
            @search-item="showModalFormSearchItem = true"
          />
        </template>
      </ModalFormAddItem>
      <ModalFormSearchItem
        :show="showModalFormSearchItem"
        @close="showModalFormSearchItem = false"
      >
        <template #header>Buscar item</template>
        <template #body>
          <FormSearchItem
            @close-modal="showModalFormSearchItem = false"
            @save-item="saveItem"
            :idAdd="itemEditData.idAdd"
          />
        </template>
      </ModalFormSearchItem>
      <ModalFormItem
        :show="showModalFormItem"
        @close="showModalFormItem = false"
      >
        <template #header>Novo item</template>
        <template #body>
          <FormItem2
            @close-modal="showModalFormItem = false"
            @save-item="saveItem"
            :itemEditData="itemEditData"
          />
        </template>
      </ModalFormItem>
    </Teleport>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import draggable from 'vuedraggable';
import ModalFormAddItem from "../ModalBase.vue";
import ModalFormSearchItem from "../ModalBase.vue";
import ModalFormItem from "../ModalBase.vue";
import FormAddItem from "./FormAddItem.vue";
import FormSearchItem from "./FormSearchItem.vue";
import FormItem2 from "./FormItem2.vue";
import { useStore } from 'vuex';
import axios from 'axios';

export default {
  name: "FormComplement",
  components: {
    draggable,
    ModalFormAddItem,
    ModalFormSearchItem,
    ModalFormItem,
    FormAddItem,
    FormSearchItem,
    FormItem2,
  },
  setup() {
    const store = useStore();
    const showModalFormAddItem = ref(false);
    const showModalFormSearchItem = ref(false);
    const showModalFormItem = ref(false);

    const productTerm = ref('');
    const productList = ref([]);

    const searchProducts = computed(() => {
      if (!productList.value || !Array.isArray(productList.value)) {
        return [];
      }
      if (productTerm.value === '') {
        return [];
      }
      let matches = 0;
      return productList.value.filter((product) => {
        if (
          product.name.toLowerCase().includes(productTerm.value.toLowerCase()) &&
          matches < 10
        ) {
          matches++;
          return product;
        }
      });
    });

    const loadProducts = () => {
      productList.value = Object.values(store.state.items);
    };

    onMounted(() => {
      loadProducts();
    });

    return {
      showModalFormAddItem,
      showModalFormSearchItem,
      showModalFormItem,
      productTerm,
      searchProducts,
      productList,
      loadProducts,
    };
  },
  data() {
    return {
      itemEditData: {}, // Inicializa com um objeto vazio
      invalid: {
        name: false,
      },
      dataComplement: this.resetFormData(), // Inicializa com dados resetados
    };
  },
  props: {
    complementEditData: Object,
  },
  watch: {
    complementEditData: {
      immediate: true,
      handler(newData) {
        if (newData && Object.keys(newData).length > 0) {
          this.dataComplement = {
            ...this.resetFormData(), // Reseta antes de atribuir novos dados
            ...newData, // Sobrescreve os valores com os dados de edição
          };
        }
      },
    },
  },
  methods: {
    orderList(dataList) {
      return dataList.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    },
    selectProduct(selectedProduct) {
      if (
        !this.dataComplement.items.some(
          (product) =>
            product.name.toLowerCase() === selectedProduct.name.toLowerCase()
        )
      ) {
        this.dataComplement.items.push(selectedProduct);
      }
    },
    saveItem(itemData) {
      if (typeof itemData === "object") {
        const existingItemIndex = this.dataComplement.items.findIndex(
          item => item.id === itemData.id
        );

        if (existingItemIndex !== -1) {
          this.dataComplement.items[existingItemIndex] = itemData; // Atualiza o item existente diretamente no array
        } else if (typeof itemData.idAdd === "number") {
          if (Array.isArray(this.dataComplement.items[itemData.idAdd].items)) {
            this.dataComplement.items[itemData.idAdd].items.push(itemData); // Adiciona subitem
          } else {
            this.dataComplement.items[itemData.idAdd].items = [itemData]; // Cria novo array de subitens
          }
        } else {
          this.dataComplement.items.push(itemData); // Adiciona novo item
        }
      }
    },
    editItem(index) {
      if (typeof index === "number") {
        this.itemEditData = { ...this.dataComplement.items[index] }; 
        this.showModalFormItem = true;  
      }
    },
    addItem() {
      this.resetFormData(); // Resetar os dados ao adicionar um novo item
      this.showModalFormItem = true;  
    },
    removeItem(index) {
      if (typeof index === "number") {
        this.dataComplement.items.splice(index, 1);
      }
    },
    removeSubItem(i, index) {
      if (typeof index === "number" && typeof i === "number") {
        this.dataComplement.items[index].items.splice(i, 1);
      }
    },
    toggleRequiredSelection() {
      if (this.dataComplement.selectOne) {
        this.dataComplement.min_selections = 1;
        this.dataComplement.is_required = true;
      } else {
        this.dataComplement.min_selections = 0;
        this.dataComplement.is_required = false;
      }
    },
    validateNumber(field) {
      if (this.dataComplement[field] < 0) {
        this.dataComplement[field] = 0;
      }
    },
    valid(data) {
      let count = 0;
      let isvalid = true;
      for (const field in this.invalid) {
        count++;
        if (this.invalid.hasOwnProperty(field)) {
          if (typeof data[field] === "string" && data[field] === "") {
            this.invalid[field] = true;
            isvalid = false;
          } else {
            this.invalid[field] = false;
          }
          if (count === Object.keys(this.invalid).length) {
            return isvalid;
          }
        }
      }
    },
    resetFormData() {
      return {
        name: "",
        active: true,
        items: [],
        selectOne: true,
        selectNumber: 1,
        selectMore: false,
        moreNumber: 1,
      };
    },
    async save() {
      if (this.valid(this.dataComplement)) {
        const itemsIds = this.dataComplement.items
          .map(item => item.id)
          .filter(id => id && id !== 0);

        if (itemsIds.length === 0) {
          console.error("Nenhum item válido selecionado.");
          return;
        }

        try {
          let response;
          if (this.dataComplement.id) {
            response = await axios.put(
              `https://api.prattuapp.com.br/api/componentsproduct/${this.dataComplement.id}`,
              {
                component_name: this.dataComplement.name,
                max_selections: this.dataComplement.selectNumber,
                min_selections: this.dataComplement.selectOne ? 1 : 0,
                max_item_select: this.dataComplement.selectMore ? this.dataComplement.moreNumber : 1,
                is_required: this.dataComplement.selectOne,
                items: itemsIds,
              },
              {
                headers: {
                  Authorization: `Bearer ${this.$store.state.token}`,
                },
              }
            );
          } else {
            response = await axios.post(
              "https://api.prattuapp.com.br/api/products/component-items",
              {
                component_name: this.dataComplement.name,
                max_selections: this.dataComplement.selectNumber,
                min_selections: this.dataComplement.selectOne ? 1 : 0,
                max_item_select: this.dataComplement.selectMore ? this.dataComplement.moreNumber : 1,
                is_required: this.dataComplement.selectOne,
                restaurant_id: this.$store.state.restaurantId,
                items: itemsIds,
              },
              {
                headers: {
                  Authorization: `Bearer ${this.$store.state.token}`,
                },
              }
            );
          }

          this.$emit('saveComplement', response.data);

          await this.$store.dispatch('fetchFormCategoriesAndComplements');
          await this.$store.dispatch('fetchMenusAndItems');

          this.$emit('closeModal');
        } catch (error) {
          console.error("Erro ao salvar complemento:", error);
        }
      }
    },

    async deleteComponent() {
      if (this.dataComplement.id) {
        try {
          await axios.delete(
            `https://api.prattuapp.com.br/api/componentsproduct/${this.dataComplement.id}`,
            {
              headers: {
                Authorization: `Bearer ${this.$store.state.token}`,
              },
            }
          );

          this.$emit('deleteComplement', this.dataComplement.id);
          await this.$store.dispatch('fetchFormCategoriesAndComplements');
          await this.$store.dispatch('fetchMenusAndItems');

          this.$emit('closeModal');
        } catch (error) {
          console.error("Erro ao excluir complemento:", error);
        }
      }
    }
  }
};
</script>





<style lang="scss" scoped>
.modal-body .container-data {
  width: 500px;
  padding: 0 !important;
}

.header .title {
  margin-top: 10px;
}

.status label {
  margin-top: 5px;
  float: right;
}

.hr-title {
  margin-top: 15px;
}

.input-group .block-1 {
  border-color: $gray-line;
  padding-top: 8px;
  background-color: $white-primary;
}

.input-group .block-2 {
  background-color: $gray-line;
}

.input-group .block-3 {
  border-radius: 0 9px 9px 0 !important;
}

.form-floating {
  margin-top: -12px;
}

.item-description {
  height: 80px;
}

.rules {
  border: 1px solid $gray-line;
  border-radius: 9px !important;
  margin-top: 20px;
  padding: 15px;
}

.rules h2 {
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 2px;
}

.rules .hint {
  margin: 5px 0;
}

.rules hr {
  margin: 5px 0 20px 0;
}

.rules p.text {
  font-size: 16px;
  font-weight: 500;
  margin: 16px 0 0 0;
}

.rules input.number {
  width: 50px;
  margin-top: 5px;
}

.accordion-button:not(.collapsed) {
  background-color: transparent;
  border: none !important;
  color: $black-secondary;
  box-shadow: none;
}

.accordion-header {
  position: relative;
  font-size: 16px;
  height: 45px;
  font-weight: 400;
  padding-top: 13px;
  padding-left: 16px;
}

.accordion-button {
  position: absolute;
  top: 0;
  right: 3px;
  width: 40px;
  padding-left: 8px;
  background-color: transparent;
}

.accordion-header .icon-drag {
  margin-top: -5px;
}

.accordion-header .item-price {
  padding: 6px 14px;
  margin-right: 15px;
  border-radius: 4px;
  position: relative;
  top: 1px;
  position: absolute;
  top: 7px;
  right: 35px;
}

.accordion-header .icon-options {
  background-size: 26px 26px;
  height: 26px;
  width: 26px;
  position: absolute;
  top: 8px;
  right: 5px;
}

.accordion-body {
  padding-top: 0;
}

.item-actions .dropdown {
  position: absolute;
  right: 0;
  top: 0;
}

.item-actions .dropdown-toggle::after {
  display: none;
}

.item-actions .dropdown li {
  border-top: 1px solid $gray-line;
  padding-top: 10px;
  padding-bottom: 10px;
  list-style: none;
}

.item-actions .dropdown li:first-child {
  border-top: none !important;
}

.dropdown-menu {
  padding: 2px 15px;
}

.list-item .accordion-item {
  background-color: $gray-bg;
}

.list-item .accordion-header .item-price {
  background-color: $white-primary;
}

.list-subitem {
  background-color: $white-primary;
}

.list-subitem .item-price {
  background-color: $gray-bg;
}
</style>
