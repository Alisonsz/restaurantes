<template>
  <div class="promotions container-report">
    <Navbar :navbarData="navbarData" />
    <Sidebar activePage="promotions" />
    <h3 class="bold-700 title">Promoções</h3>
    <div class="content report-data">
      <!-- Primeiro container: Promoções -->
      <h4>Crie, edite, acompanhe e meça os resultados das promoções criadas para o seu estabelecimento.</h4>
      <div class="columns">
        <div class="column" @click="openModal(1)">
          <div class="promotion-header">
            <img src="@/assets/img/storefront.svg" alt="Ícone de desconto" class="icon" />
            <h4 class="promotion-title">Desconto em toda loja</h4>
          </div>
          <p class="promotion-desc">Aplique uma porcentagem de desconto em todos os itens do cardápio e atraia cada vez mais clientes!</p>
          <div class="promotion-footer">
            <button class="promotion-button">Criar promoção</button>
          </div>
        </div>

        <div class="column" @click="openModal(2)">
          <div class="promotion-header">
            <img src="@/assets/img/lunch_dining.svg" alt="Ícone de desconto em produtos" class="icon" />
            <h4 class="promotion-title">Desconto em produtos</h4>
          </div>
          <p class="promotion-desc">Crie descontos em produtos específicos para atrair mais clientes e vender cada vez mais!</p>
          <div class="promotion-footer">
            <button class="promotion-button">Criar promoção</button>
          </div>
        </div>

        <div class="column" @click="openModal(3)">
          <div class="promotion-header">
            <img src="@/assets/img/award_star.svg" alt="Ícone de cupom de desconto" class="icon" />
            <h4 class="promotion-title">Cupom de desconto</h4>
          </div>
          <p class="promotion-desc">Crie cupons de desconto personalizados para oferecer aos seus clientes e fidelizá-los!</p>
          <div class="promotion-footer">
            <button class="promotion-button">Criar promoção</button>
          </div>
        </div>
      </div>

      <!-- Segundo container: Promoções em Vigor -->
      <h3 class="bold-600" style="margin-top: 40px;">Promoções em Vigor</h3>
      <hr style="border: 0; border-top: 1px solid #DCDCDC; margin: 10px 0;">
      <div class="search-pagination-container">
        <div class="search-bar">
          <input 
            type="text" 
            placeholder="Nome da promoção" 
            class="search-input" 
            v-model="searchTerm" 
            @input="updateSearch"
          />
          <button class="search-button">
            <img src="@/assets/img/search.svg" alt="Ícone de busca" class="search-icon" />
          </button>
        </div>
        <Pagination 
          @select-page="setPageNumber" 
          :pageNumber="pageNumber" 
          :setPageNumber="setPageNumber" 
          :pageRecords="pageRecords" 
          :totalRecords="filteredPromotions.length" 
        />
      </div>

      <!-- Tabela de promoções em vigor -->
      <table class="promotion-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>%</th>
            <th>Início</th>
            <th>Término</th>
            <th>Usados</th>
            <th>Tipo de promoção</th>
            <th>Status</th>
            <th></th> <!-- Coluna vazia para o botão de editar -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="promo in paginatedPromotions" :key="promo.id">
            <td>{{ promo.name }}</td>
            <td>{{ promo.percentage }}%</td>
            <td>{{ formatDate(promo.start) }}</td>
            <td>{{ formatDate(promo.end) }}</td>
            <td>{{ promo.used }}</td>
            <td>
              <span class="promo-type">{{ getPromotionType(promo.type) }}</span>
            </td>
            <td>
              <label class="switch">
                <input type="checkbox" v-model="promo.status">
                <span class="slider round"></span>
              </label>
            </td>
            <td>
              <button class="edit-button btn-round input-base" @click="openModal(promo.type, promo)">
                <img src="@/assets/img/stylus.svg" alt="Ícone de editar" />
                Editar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal de promoção -->
    <ModalPromotion 
      :show="showModal" 
      :promotion="selectedPromotion" 
      @close="showModal = false"
      @save="savePromotion"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';  
import axios from 'axios';
import Navbar from '../components/Navbar.vue';
import Sidebar from '../components/Sidebar.vue';
import Pagination from '../components/Pagination.vue';
import ModalPromotion from '../components/ModalPromotion.vue'; // Importa o modal

const navbarData = {};
const sidebarData = {};

// Estado do modal
const showModal = ref(false);
const selectedPromotion = ref(null); 
const promotions = ref([]); 
const searchTerm = ref('');

const store = useStore(); 

async function loadPromotions() {
  try {
    const response = await axios.get('https://api.prattuapp.com.br/api/discounts', {
      headers: {
        'Authorization': `Bearer ${store.state.token}`
      }
    });

    const productDiscounts = response.data.product_discounts.map(discount => ({
      id: discount.id,
      name: discount.name,
      percentage: discount.value,
      start: discount.valid_from ? discount.valid_from.split(' ')[0] : null,
      end: discount.valid_until ? discount.valid_until.split(' ')[0] : null,
      used: discount.times_used,
      type: 2,
      status: discount.status,
      created_at: discount.created_at,
      product_id: discount.product_id  // Incluindo o product_id
    }));

    const storePromotions = response.data.store_promotions.map(promotion => ({
      id: promotion.id,
      name: promotion.name,
      percentage: promotion.discount_percentage,
      start: promotion.valid_from ? promotion.valid_from.split(' ')[0] : null,
      end: promotion.valid_until ? promotion.valid_until.split(' ')[0] : null,
      used: promotion.times_used,
      type: 1,
      status: promotion.status,
      created_at: promotion.created_at
    }));

    const coupons = response.data.coupons.map(coupon => ({
      id: coupon.id,
      name: coupon.name,
      percentage: coupon.value,
      start: coupon.valid_from ? coupon.valid_from.split(' ')[0] : null,
      end: coupon.valid_until ? coupon.valid_until.split(' ')[0] : null,
      used: coupon.times_used,
      type: 3,
      status: coupon.status,
      created_at: coupon.created_at,
      code: coupon.code  // Incluindo o code
    }));

    promotions.value = [...productDiscounts, ...storePromotions, ...coupons];

    // Ordena as promoções pela data de criação, do mais recente para o mais antigo
    promotions.value.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  } catch (error) {
    console.error('Erro ao carregar promoções:', error);
  }
}



onMounted(() => {
  loadPromotions();
});

function getPromotionType(type) {
  const types = {
    1: 'Desconto em toda loja',
    2: 'Desconto em produtos',
    3: 'Cupom de desconto'
  };
  return types[type] || 'Desconhecido';
}

function formatDate(date) {
  if (!date || date === '9999-12-31' || date === null) {
    return 'Nunca';
  }
  
  const [year, month, day] = date.split('-');
  const formattedDate = new Date(`${month}/${day}/${year}`);
  
  return formattedDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}


const filteredPromotions = computed(() => {
  const term = searchTerm.value.toLowerCase();
  if (term.length > 1) {
    return promotions.value.filter(promo =>
      promo.name.toLowerCase().includes(term)
    );
  }
  return promotions.value;
});

const pageNumber = ref(1);
const pageRecords = 5;

const paginatedPromotions = computed(() => {
  const startIndex = (pageNumber.value - 1) * pageRecords;
  return filteredPromotions.value.slice(startIndex, startIndex + pageRecords);
});

function openModal(type, promo = null) {
  if (promo) {
    selectedPromotion.value = { ...promo, type: promo.type };
  } else {
    selectedPromotion.value = { name: '', percentage: 0, start: '', end: '', couponCode: '', type, selectedProducts: [] };
  }
  showModal.value = true;
}


function updateSearch(event) {
  searchTerm.value = event.target.value;
  pageNumber.value = 1;
}

function setPageNumber(value) {
  pageNumber.value = value;
}

function savePromotion(promo) {
  if (promo.id) {
    const index = promotions.value.findIndex(p => p.id === promo.id);
    if (index !== -1) {
      promotions.value[index] = { ...promo };
    }
  } else {
    promo.id = promotions.value.length + 1;
    promotions.value.push(promo);
  }
  showModal.value = false;
}
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Red+Hat+Text:wght@400&display=swap');

h3.title {
  font-size: 23px;
  margin-top: 12px;
  margin-bottom: 25px;
}

.container-data {
  display: flex;
}

.content {
  flex-grow: 1;
  padding: 40px;
  font-family: 'Red Hat Text', sans-serif;
}

.columns {
  display: flex;
  gap: 16px;
  flex-wrap: wrap; /* Adiciona quebra de linha em telas menores */
}

.column {
  flex: 1;
  border: 1px solid #DCDCDC;
  padding: 24px;
  box-sizing: border-box;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Distribui espaço entre os itens */
}

.promotion-header {
  display: flex;
  align-items: center;
  background-color: #202025;
  padding: 16px;
  gap: 10px;
  border-radius: 4px;
}

.icon {
  flex-shrink: 0;
}

.promotion-title {
  color: white;
  font-weight: medium;
  font-size: 16px;
  margin: 0;
}

.promotion-desc {
  font-size: 16px;
  margin: 24px 0;
  min-height: 40px; /* Altura mínima para alinhar os botões */
}

.promotion-footer {
  display: flex;
  justify-content: flex-start; /* Alinha o botão à esquerda */
}

.promotion-button {
  background-color: $light-green;
  color: black;
  border: none;
  border-radius: 100px !important; /* Arredondamento com 100px */
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  line-height: 1; /* Ajuste o line-height para alinhar o texto verticalmente */
  display: flex;
  align-items: center; /* Centraliza verticalmente o texto */
  justify-content: center; /* Centraliza horizontalmente o texto */
}

.promotion-button:hover {
  background-color: darkgreen;
}

/* Responsividade */
@media (max-width: 768px) {
  .columns {
    flex-direction: column;
  }

  .column {
    margin-bottom: 16px;
  }
}

h4 {
  font-size: 16px;
  font-weight: normal;
  margin-bottom: 20px;
  text-align: left;
  line-height: 26px;
}

.search-pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  margin-top: 40px;
}

.search-bar {
  display: flex;
  align-items: center;
  position: relative; /* Adiciona o posicionamento relativo ao contêiner */
}

.search-input {
  padding: 19px 16px;
  border: 1px solid #DCDCDC;
  border-radius: 4px;
  outline: none;
  min-width: 350px;
  flex-grow: 1;
  box-sizing: border-box; /* Garante que o padding não afete a largura total */
}

.search-button {
  background: none; /* Remove o background do botão */
  border: none;
  cursor: pointer;
  position: absolute;
  right: 16px; /* Ajusta o botão de busca para ficar à direita do input */
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-icon {
  width: 16px;
  height: 16px;
  color: #000; /* Define a cor do ícone para combinar com o input */
}

.search-input:focus + .search-button .search-icon {
  color: #000; /* Ajusta a cor do ícone quando o input está em foco */
}

.promotion-table {
  width: 100%;
  border-collapse: separate;
}

.promotion-table th,
.promotion-table td {
  padding: 12px;
  border-bottom: 1px solid #DCDCDC;
  text-align: left;
  height: 102px;
  vertical-align: middle; /* Alinha o texto verticalmente */
}

.promo-type {
  background-color: #D0F4EA; 
  color: #006064; 
  padding: 10px 20px; 
  border-radius: 100px; 
  font-size: 14px;
  color: black;
  font-weight: 500;
}

.status-switch {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-text {
  font-size: 14px;
  color: #006064;
}

.edit-button {
  background-color: white;
  color: black;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}

.edit-button img {
  width: 16px;
  height: 16px;
}

.edit-button:hover {
  background-color: #e9e3e3;
}

</style>
