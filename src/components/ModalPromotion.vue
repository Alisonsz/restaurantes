<template>
  <Transition name="modal-fade">
    <div v-if="show" class="modal-mask">
      <div class="modal-container">
        <div class="modal-header">
          <button class="icon-back2 modal-default-button icon-back" @click="$emit('close')" v-if="!noClose"></button>
          <h3>{{ getPromotionTitle(formData.type) }}</h3>
        </div>
        <hr class="hr-header" />
        <div class="modal-body">
          <div class="form-row top-row">
            <div class="form-group name-group">
              <label for="promotionName">Nome da Promoção</label>
              <input
                type="text"
                id="promotionName"
                v-model="formData.name"
                class="form-input"
                @change="validate()"
              />
            </div>
            <div
              v-if="formData.type === 2"
              class="form-group additional-group"
            >
              <label for="selectedProducts">Produto Selecionado</label>
              <select
                id="selectedProducts"
                v-model="formData.selectedProducts"
                class="form-select"
                @change="validate()"
              >
                <option
                  v-for="product in filteredProducts"
                  :key="product.id"
                  :value="product.id"
                >
                  {{ product.name }}
                </option>
              </select>
            </div>
            <div
              v-if="formData.type === 3"
              class="form-group additional-group"
            >
              <label for="couponCode">Código do Cupom</label>
              <input
                type="text"
                id="couponCode"
                v-model="formData.couponCode"
                class="form-input"
                @change="validate()"
              />
            </div>
          </div>

          <div class="form-row bottom-row">
            <div class="form-group percentage-group">
              <label for="promotionPercentage">Porcentagem de Desconto (%)</label>
              <div class="form-time">
                <button
                  class="btn btn-minus"
                  @click="changePercentage('minus')"
                >
                  <span class="add-item add-right add-minus"></span>
                </button>
                <input
                  type="number"
                  id="promotionPercentage"
                  v-model.number="formData.percentage"
                  class="form-input text"
                  @change="validate()"
                />
                <button class="btn btn-plus" @click="changePercentage('plus')">
                  <span class="add-item add-right add-plus"></span>
                </button>
              </div>
            </div>

            <div class="form-group date-group">
              <label for="promotionStart">Data de Início</label>
              <input
                type="date"
                id="promotionStart"
                v-model="formData.start"
                class="form-input date-input"
                @change="validate()"
              />
            </div>
            <div class="form-group date-group">
              <label for="promotionEnd">Data de Término</label>
              <input
                type="date"
                id="promotionEnd"
                v-model="formData.end"
                class="form-input date-input"
                :disabled="formData.noEnd"
                :required="!formData.noEnd"
                @change="validate()"
              />
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <div class="left-footer">
            <div class="inline-checkbox">
              <input
                type="checkbox"
                id="noEndCheckbox"
                v-model="formData.noEnd"
                @change="validate()"
              />
              <label for="noEndCheckbox">Não expirar</label>
            </div>
          </div>
          <div class="right-footer">
            <button
              v-if="isEditing"
              @click="deletePromotion"
              class="btn-delete"
            >
              Deletar
            </button>
            <button @click="savePromotion" class="btn-save" :class="validate() ? 'enabled' : 'disabled'" :disabled="!validate()">Salvar</button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';

const props = defineProps({
  show: Boolean,
  promotion: Object,
  noClose: Boolean,
});

const emit = defineEmits(['close', 'save', 'delete']);

const formData = ref({
  id: null,
  name: '',
  percentage: 0,
  start: '',
  end: '',
  couponCode: '',
  type: null,
  selectedProducts: '',
  noEnd: false,
});

const products = ref([]);
const searchQuery = ref('');

const store = useStore();

async function fetchProducts() {
  try {
    const response = await axios.get(
      'https://api.prattuapp.com.br/api/restaurants/1',
      {
        headers: {
          Authorization: `Bearer ${store.state.token}`,
        },
      }
    );
    products.value = response.data.products;
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
  }
}

// Carrega os produtos quando o componente é montado
onMounted(() => {
  fetchProducts();
});

watch(
  () => props.promotion,
  (newPromotion) => {
    if (newPromotion) {
      formData.value = {
        id: newPromotion.id || null,
        name: newPromotion.name || '',
        percentage: newPromotion.percentage || 0,
        start: newPromotion.start ? newPromotion.start.split(' ')[0] : '',
        end: newPromotion.end ? newPromotion.end.split(' ')[0] : '',
        couponCode: newPromotion.code || '',
        type: newPromotion.type || null,
        selectedProducts: newPromotion.product_id || '',
        noEnd: !newPromotion.end,
      };
    } else {
      resetFormData();
    }
  },
  { immediate: true }
);

function resetFormData() {
  formData.value = {
    id: null,
    name: '',
    percentage: 0,
    start: '',
    end: '',
    couponCode: '',
    type: null,
    selectedProducts: '',
    noEnd: false,
  };
}

function getPromotionTitle(type) {
  const titles = {
    1: 'Desconto em toda loja',
    2: 'Desconto em produto',
    3: 'Cupom de desconto',
  };
  return titles[type] || 'Nova Promoção';
}

function validate() {
  if (formData.value.type === 1) {
    if (
      formData.value.name.trim() !== ""
      && formData.value.percentage > 0
      && formData.value.start.trim() !== ""
      && (formData.value.noEnd || (!formData.value.noEnd && formData.value.end.trim() !== ""))
    ) {
      return true
    }
  }
  if (formData.value.type === 2) {
    if (
      formData.value.name.trim() !== ""
      && formData.value.selectedProducts.trim() !== ""
      && formData.value.percentage > 0
      && formData.value.start.trim() !== ""
      && (formData.value.noEnd || (!formData.value.noEnd && formData.value.end.trim() !== ""))
    ) {
      return true
    }
  }
  if (formData.value.type === 3) {
    if (
      formData.value.name.trim() !== ""
      && formData.value.couponCode.trim() !== ""
      && formData.value.percentage > 0
      && formData.value.start.trim() !== ""
      && (formData.value.noEnd || (!formData.value.noEnd && formData.value.end.trim() !== ""))
    ) {
      return true
    }
  }
  return false
}

function changePercentage(operation) {
  if (operation === 'plus') {
    formData.value.percentage = (formData.value.percentage || 0) + 1;
  } else if (operation === 'minus') {
    formData.value.percentage = (formData.value.percentage || 0) - 1;
    if (formData.value.percentage < 0) {
      formData.value.percentage = 0;
    }
  }
}

async function savePromotion() {
  try {
    const url = formData.value.id
      ? `https://api.prattuapp.com.br/api/discounts/${formData.value.id}/${formData.value.type}`
      : 'https://api.prattuapp.com.br/api/discounts';

    const method = formData.value.id ? 'put' : 'post';
    const data = {
      type: formData.value.type,
      name: formData.value.name,
      discount_percentage: formData.value.percentage,
      valid_from: formData.value.start,
      valid_until: formData.value.noEnd ? null : formData.value.end,
      status: true,
    };

    if (formData.value.type === 2) {
      data.product_id = formData.value.selectedProducts;
      data.value = formData.value.percentage;
    } else if (formData.value.type === 3) {
      data.code = formData.value.couponCode;
      data.value = formData.value.percentage;
    }

    await axios[method](url, data, {
      headers: {
        Authorization: `Bearer ${store.state.token}`,
      },
    });

    emit('save', formData.value);
    emit('close');
    window.location.reload();
  } catch (error) {
    console.error('Erro ao salvar a promoção:', error);
  }
}

async function deletePromotion() {
  console.log('ID da promoção antes de deletar:', formData.value.id);

  if (!formData.value.id) {
    console.error('ID da promoção está indefinido. Não é possível deletar.');
    return;
  }

  try {
    await axios.delete(
      `https://api.prattuapp.com.br/api/discounts/${formData.value.id}/${formData.value.type}`,
      {
        headers: {
          Authorization: `Bearer ${store.state.token}`,
        },
      }
    );

    emit('delete', formData.value);
    emit('close');
    window.location.reload();
  } catch (error) {
    console.error('Erro ao deletar a promoção:', error.response ? error.response.data : error.message);
  }
}

const filteredProducts = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return products.value.filter((product) =>
    product.name.toLowerCase().includes(query)
  );
});

const isEditing = computed(() => {
  return !!(formData.value.id);
});
</script>



<style lang="scss" scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-container {
  width: 700px;
  padding: 20px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 5px;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: bold;
}

.modal-body {
  margin: 20px 0;
}

.form-group {
  margin-bottom: 20px;
  width: 100%;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form-row {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.left-footer,
.right-footer {
  display: flex;
  align-items: center;
}

.left-footer {
  flex-grow: 1;
}

.inline-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
}

.top-row {
  display: flex;
  justify-content: space-between;
}

.name-group,
.additional-group {
  flex: 1;
  margin-right: 20px;
}

.date-group {
  flex: 1;
}

.bottom-row {
  display: flex;
  gap: 20px;
}

.percentage-group {
  flex: 1;
}

.form-time {
  display: flex;
  align-items: center;
}

.btn-minus,
.text,
.btn-plus {
  display: inline-block;
  margin-right: 10px;
}

.btn-minus,
.btn-plus {
  border: 1px solid #ccc;
  background-color: #f5f5f5;
  padding: 10px;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.text {
  width: 120px;
  text-align: center;
  height: 100%;
  box-sizing: border-box;
}

.btn-save {
  padding: 10px 20px;
  border: none;
  border-radius: 100px;
  color: black;
  cursor: pointer;
  font-size: 16px;
}

.btn-save.enabled {
  background-color: $light-green;
}

.btn-save.disabled {
  background-color: $gray-tab;
}

.btn-save.enabled:hover {
  background-color: darkgreen;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s;
}

.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}

.icon-back2 {
  width: 30px !important;
  height: 30px !important;
  background-color: transparent;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 13px 13px;
  border: none;
}

.hr-header {
  margin-top: 15px;
}

.btn-delete {
  padding: 10px 20px;
  background-color: #f44336;
  border: none;
  border-radius: 100px;
  color: white;
  cursor: pointer;
  font-size: 16px;
  margin-left: 10px;
  line-height: 16px;
  margin-right: 15px;
}

.btn-delete:hover {
  background-color: darkred;
}

.add-item {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  margin-bottom: 5px;

}
/* Remove as setas de incremento/decremento em navegadores Webkit (Chrome, Safari) */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Remove as setas de incremento/decremento em navegadores Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}

/* Remove as setas de incremento/decremento em navegadores modernos que suportam a propriedade 'appearance' */
input[type="number"] {
  appearance: none;
}

</style>
