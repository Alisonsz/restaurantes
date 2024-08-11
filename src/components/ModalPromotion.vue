<template>
  <Transition name="modal-fade">
    <div v-if="show" class="modal-mask">
      <div class="modal-container">
        <div class="modal-header">
          <button class="icon-back2" @click="$emit('close')" v-if="noClose !== true">
            <img src="@/assets/img/back.svg" alt="Voltar" />
          </button>
          <h3>{{ getPromotionTitle(formData.type) }}</h3>
        </div>
        <hr class="hr-header">
        <div class="modal-body">
          <div class="form-row top-row">
            <div class="form-group name-group">
              <label for="promotionName">Nome da Promoção</label>
              <input type="text" id="promotionName" v-model="formData.name" class="form-input" />
            </div>
            <div v-if="formData.type === 2" class="form-group additional-group">
              <label for="selectedProducts">Produto Selecionado</label>
              <select id="selectedProducts" v-model="formData.selectedProducts" class="form-select">
                <option v-for="product in filteredProducts" :key="product.id" :value="product.id">
                  {{ product.name }}
                </option>
              </select>
            </div>
            <div v-if="formData.type === 3" class="form-group additional-group">
              <label for="couponCode">Código do Cupom</label>
              <input type="text" id="couponCode" v-model="formData.couponCode" class="form-input" />
            </div>
          </div>

          <div class="form-row bottom-row">
            <div class="form-group percentage-group">
              <label for="promotionPercentage">Porcentagem de Desconto (%)</label>
              <div class="form-time">
                <button class="btn btn-minus" @click="changePercentage('minus')">
                  <span class="add-item add-right add-minus"></span>
                </button>
                <input
                  type="number"
                  id="promotionPercentage"
                  v-model.number="formData.percentage"
                  class="form-input text"
                />
                <button class="btn btn-plus" @click="changePercentage('plus')">
                  <span class="add-item add-right add-plus"></span>
                </button>
              </div>
            </div>

            <div class="form-group date-group">
              <label for="promotionStart">Data de Início</label>
              <input type="date" id="promotionStart" v-model="formData.start" class="form-input date-input" />
            </div>
            <div class="form-group date-group">
              <label for="promotionEnd">Data de Término</label>
              <input type="date" id="promotionEnd" v-model="formData.end" class="form-input date-input" />
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="savePromotion" class="btn-save">Salvar</button>
          <button v-if="isEditing" @click="deletePromotion" class="btn-delete">Deletar</button>
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
    name: '',
    percentage: 0,
    start: '',
    end: '',
    couponCode: '',
    type: null,
    selectedProducts: '',
  });
  
  const products = ref([]);
  const searchQuery = ref('');
  
  const store = useStore();
  
  // Buscar produtos do restaurante
  async function fetchProducts() {
    try {
      const response = await axios.get('https://api.prattuapp.com.br/api/restaurants/1', {
        headers: {
          'Authorization': `Bearer ${store.state.token}`
        }
      });
  
      products.value = response.data.products;
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  }
  
  // Monta o componente e busca os produtos
  onMounted(() => {
    fetchProducts();
  });
  
  // Atualiza o formData ao detectar mudanças na promoção selecionada
  watch(() => props.promotion, (newPromotion) => {
    if (newPromotion && newPromotion !== null) {
      formData.value = { ...newPromotion };
      if (newPromotion.type === 2 && newPromotion.product_id) {
        formData.value.selectedProducts = newPromotion.product_id;
      }
    } else {
      resetFormData();
    }
  });
  
  // Reseta os dados do formulário quando uma nova promoção é criada
  function resetFormData() {
    formData.value = {
      name: '',
      percentage: 0,
      start: '',
      end: '',
      couponCode: '',
      type: null,
      selectedProducts: '',
    };
  }
  
  // Retorna o título apropriado com base no tipo de promoção
  function getPromotionTitle(type) {
    const titles = {
      1: 'Desconto em toda loja',
      2: 'Desconto em produto',
      3: 'Cupom de desconto',
    };
    return titles[type] || 'Nova Promoção';
  }
  
  // Função para aumentar ou diminuir a porcentagem de desconto
  function changePercentage(operation) {
    if (operation === 'plus') {
      formData.value.percentage += 1;
    } else if (operation === 'minus') {
      formData.value.percentage -= 1;
      if (formData.value.percentage < 0) {
        formData.value.percentage = 0;
      }
    }
  }
  
  // Salva ou atualiza a promoção e fecha o modal
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
        valid_until: formData.value.end,
        status: true
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
          'Authorization': `Bearer ${store.state.token}`
        }
      });
  
      emit('save', formData.value);
      emit('close');
      window.location.reload(); // Atualiza a página após salvar
    } catch (error) {
      console.error('Erro ao salvar a promoção:', error);
    }
  }
  
  // Deleta a promoção e fecha o modal
  async function deletePromotion() {
    try {
      await axios.delete(`https://api.prattuapp.com.br/api/discounts/${formData.value.id}/${formData.value.type}`, {
        headers: {
          'Authorization': `Bearer ${store.state.token}`
        }
      });
  
      emit('delete', formData.value);
      emit('close');
      window.location.reload(); // Atualiza a página após deletar
    } catch (error) {
      console.error('Erro ao deletar a promoção:', error);
    }
  }
  
  // Computed para filtrar produtos com base na pesquisa
  const filteredProducts = computed(() => {
    const query = searchQuery.value.toLowerCase();
    return products.value.filter(product =>
      product.name.toLowerCase().includes(query)
    );
  });
  
  // Computed para verificar se estamos editando uma promoção existente
  const isEditing = computed(() => {
    return formData.value.name !== '';
  });
  </script>
  
  
  <style scoped>
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
    width: 700px; /* Aumentei a largura do modal */
    padding: 20px;
    background-color: #fff;
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
  }
  
  .modal-header {
    display: flex;
    align-items: center;
    gap: 30px;
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
    padding: 10px 10px;
    cursor: pointer;
    border-radius: 4px;
  }
  
  .text {
    width: 120px; /* Aumentei um pouco o tamanho do input */
    text-align: center;

  }
  
  .btn-save {
    padding: 10px 20px;
    background-color: #7ED957;
    border: none;
    border-radius: 100px;
    color: black;
    cursor: pointer;
    font-size: 16px;
  }
  
  .btn-save:hover {
    background-color: darkgreen;
  }
  
  .modal-footer {
    display: flex;
    justify-content: flex-end;
  }
  
  .modal-fade-enter-active,
  .modal-fade-leave-active {
    transition: opacity 0.3s;
  }
  
  .modal-fade-enter,
  .modal-fade-leave-to {
    opacity: 0;
  }
  
  .icon-back2 img {
    width: 20px;
    height: 20px;
  }
  .search-group {
  margin-bottom: 20px;
}

.search-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.search-group .form-input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.btn-delete {
  padding: 10px 20px;
  background-color: #f44336; /* Cor de fundo vermelho para o botão de deletar */
  border: none;
  border-radius: 100px;
  color: white;
  cursor: pointer;
  font-size: 16px;
  margin-left: 10px;
  line-height: 16px;
}

.btn-delete:hover {
  background-color: darkred;
}
  </style>
  