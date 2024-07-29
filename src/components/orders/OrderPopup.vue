<template>
  <ModalBaseOrder :show="visible" @close="closeModal">
    <template #header>
      <div class="modal-header-content">
        <h3 @click="closeModal" class="close-header">Detalhes do pedido</h3>
      </div>
    </template>
    <template #body>
      <div class="content-container">
        <div class="tabs">
          <button :class="{ active: currentTab === 'Detalhes' }" @click="currentTab = 'Detalhes'">Detalhes</button>
          <button :class="{ active: currentTab === 'Geral' }" @click="currentTab = 'Geral'">Geral</button>
        </div>
        <div class="info-container">
          <div v-if="order && currentTab === 'Detalhes'" class="tab-panel">
            <div class="detail">
              <p class="label">Detalhes do pedido ({{ order.products.length }} itens)</p>
            </div>
            <div class="divider"></div>
            <div class="detail">
              <p class="label">Consumo:</p>
              <p class="value">Local</p>
            </div>
            <ul>
              <li v-for="product in order.products" :key="product.id">
                <strong>{{ product.product.name }}</strong> ({{ product.quantity }} {{ product.quantity > 1 ? 'unidades' : 'unidade' }})<br>
                <span>R$ {{ product.price }}</span>
              </li>
            </ul>
            <div class="divider"></div>
            <div class="total-section">
              <p class="label">Valor total</p>
              <p class="value">R$ {{ order.total }}</p>
            </div>
          </div>
          <div v-if="order && currentTab === 'Geral'" class="tab-panel">
            <div class="detail">
              <p class="label">ID do pedido:</p>
              <p class="value">{{ order.id }}</p>
            </div>
            <div class="divider"></div>
            <div class="detail">
              <p class="label">Cliente:</p>
              <p class="value">{{ order.user ? order.user.name : 'N/A' }}</p>
            </div>
            <div class="divider"></div>
            <div class="detail">
              <p class="label">Data e hora:</p>
              <p class="value">{{ formattedDate(order.created_at) }}</p>
            </div>
            <div class="divider"></div>
            <div class="detail">
              <p class="label">Tempo de preparo:</p>
              <p class="value">{{ order.restaurant.preparation_time }} minutos</p>
            </div>
            <div class="divider"></div>
            <div class="detail">
              <p class="label">Horário da retirada:</p>
              <p class="value">{{ formattedDate(order.estimated_delivery_datetime) || 'N/A' }}</p>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="modal-footer">
        <button class="btn reject" @click="rejectOrder">Recusar</button>
        <button class="btn accept" @click="acceptOrder">Aceitar</button>
      </div>
    </template>
  </ModalBaseOrder>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import ModalBaseOrder from '../ModalBaseOrder.vue';

export default {
  components: { ModalBaseOrder },
  props: {
    orderId: {
      type: Number,
      required: true,
    },
    visible: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, { emit }) {
    const store = useStore();
    const order = ref(null);
    const currentTab = ref('Detalhes');

    const fetchOrderDetails = async () => {
      if (props.orderId) {
        try {
          const response = await fetch(`https://api.prattuapp.com.br/api/orders/${props.orderId}`, {
            headers: {
              Authorization: `Bearer ${store.state.token}`,
            },
          });
          if (response.ok) {
            order.value = await response.json();
          } else {
            console.error('Erro ao buscar detalhes do pedido:', response.statusText);
          }
        } catch (error) {
          console.error('Erro ao buscar detalhes do pedido:', error);
        }
      }
    };

    const closeModal = () => {
      emit('close');
    };

    const formattedDate = (dateStr) => {
      if (!dateStr) return 'N/A';
      return new Date(dateStr).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    const acceptOrder = async () => {
      try {
        const response = await fetch(`https://api.prattuapp.com.br/api/orders/${props.orderId}/mark-as-accepted`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${store.state.token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          emit('order-accepted', props.orderId);
          // Atualize a página ao aceitar o pedido
          window.location.reload();
        } else {
          console.error('Erro ao aceitar o pedido:', response.statusText);
        }
      } catch (error) {
        console.error('Erro ao aceitar o pedido:', error);
      }
    };

    const rejectOrder = () => {
      // Lógica para recusar o pedido
    };

    watch(() => props.orderId, fetchOrderDetails);

    onMounted(fetchOrderDetails);

    return {
      order,
      currentTab,
      closeModal,
      formattedDate,
      acceptOrder,
      rejectOrder,
    };
  },
};
</script>

<style scoped>
.modal-container {
  width: 80%;
  max-width: 800px;
  min-width: 650px;
  background-color: #F1F4F4;
  border-radius: 16px;
  padding: 16px;
}

.modal-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-header {
  cursor: pointer;
  font-size: 24px;
  font-weight: 700;
}

.content-container {
  padding: 16px;
}

.tabs {
  display: flex;
  justify-content: flex-start;
}

.tabs button {
  padding: 10px 20px;
  cursor: pointer;
  background: none;
  border: none;
  outline: none;
  font-weight: 500;
  font-size: 16px;
  color: #555;
  border-radius: 16px 16px 0px 0px !important;
}

.tabs button.active {
  background-color: #baedbd;
  color: #000;
}

.info-container {
  background-color: white;
  border-radius: 0px 16px 16px 16px !important;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-width: 650px;
}

.tab-content {
  padding: 16px;
}

.detail {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
}

.detail .label {
  font-weight: bold;
  color: #333;
}

.divider {
  border-bottom: 1px solid #e0e0e0;
  margin: 8px 0;
}

.total-section {
  background-color: #f7f7f7;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}

.total-section .label,
.total-section .value {
  flex: 1;
  margin: 0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
  padding-right: 16px;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  margin-left: 8px;
}

.reject {
  background-color: #E14D4D;
  color: black;
}

.accept {
  background-color: #7ED957;
  color: black;
}
</style>
