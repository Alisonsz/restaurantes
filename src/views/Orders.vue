<template>
    <div class="performance container-report">
    <div class="report-titles">
      <Navbar :navbarData="navbarData" />
      <Sidebar :sidebarData="sidebarData" />
      <div class="header-row">
        <h3 class="bold-700">Gestor de Pedidos</h3>
        <div class="button-group">
          <button class="btn-pause-orders">
            <img src="@/assets/img/Vector.svg" alt="Pause Icon" />
            Pausar recebimento de pedidos
          </button>
          <button class="btn-adjust-time">
            <img src="@/assets/img/Vector.svg" alt="Adjust Time Icon" />
            Ajustar tempo de preparo
          </button>
        </div>
      </div>
    </div>
      <div class="orders-wrapper">
        <div class="orders-container">
          <!-- Orders Columns -->
          <div class="orders-column">
            <div class="header-container">
              <div class="header-title">Pendentes ({{ pendingOrders.length }})</div>
            </div>
            <div class="list-container">
              <div class="orders-list">
                <div v-if="pendingOrders.length === 0" class="no-orders-message">
                  Nenhum pedido
                </div>
                <div v-else>
                  <OrderCard
                    v-for="order in pendingOrders"
                    :key="order.id"
                    :order="order"
                    @view-details="openPopup"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="orders-column">
            <div class="header-container">
              <div class="header-title">Em preparação ({{ scheduledOrders.length }})</div>
            </div>
            <div class="list-container">
              <div class="orders-list">
                <div v-if="scheduledOrders.length === 0" class="no-orders-message">
                  Nenhum pedido
                </div>
                <div v-else>
                  <OrderCardScheduled
                    v-for="order in scheduledOrders"
                    :key="order.id"
                    :order="order"
                    @view-details="openPopup"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="orders-column">
            <div class="header-container">
              <div class="header-title">Pronto para retirada ({{ readyForPickupOrders.length }})</div>
            </div>
            <div class="list-container">
              <div class="orders-list">
                <div v-if="readyForPickupOrders.length === 0" class="no-orders-message">
                  Nenhum pedido
                </div>
                <div v-else>
                  <OrderCardReadyForPickup
                    v-for="order in readyForPickupOrders"
                    :key="order.id"
                    :order="order"
                    @view-details="openPopup"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <OrderPopup v-if="selectedOrderId" :order-id="selectedOrderId" :visible="isPopupVisible" @close="closePopup" />
      </div>
    </div>
  </template>
  
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import Navbar from '../components/Navbar.vue';
  import Sidebar from '../components/Sidebar.vue';
  import OrderCard from '../components/orders/OrderCard.vue';
  import OrderCardScheduled from '../components/orders/OrderCardScheduled.vue';
  import OrderCardReadyForPickup from '../components/orders/OrderCardReadyForPickup.vue';
  import OrderPopup from '../components/orders/OrderPopup.vue';
  
  export default {
    components: {
      Navbar,
      Sidebar,
      OrderCard,
      OrderCardScheduled,
      OrderCardReadyForPickup,
      OrderPopup,
    },
    setup() {
      const store = useStore();
      const pendingOrders = ref([]);
      const scheduledOrders = ref([]); // Para pedidos "Em preparação"
      const readyForPickupOrders = ref([]); // Para pedidos "Pronto para retirada"
      const selectedOrderId = ref(null);
      const isPopupVisible = ref(false);
  
      const navbarData = {
        time: "9 horas",
        notifications: 4,
      };
      const sidebarData = {
        logo: "/img/logo1.png",
        company: "TATÁ Sushi",
        address: "R. João Cachoeira, 278",
        active: "orders",
        open: false,
      };
  
      const fetchOrders = async (url, ordersRef) => {
        try {
          const response = await fetch(url, {
            headers: {
              Authorization: `Bearer ${store.state.token}`,
            },
          });
          if (response.ok) {
            ordersRef.value = await response.json();
          } else {
            console.error('Error fetching orders:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching orders:', error);
        }
      };
  
      const fetchAllOrders = () => {
        fetchOrders('https://api.prattuapp.com.br/api/orders/status/1', pendingOrders);
        fetchOrders('https://api.prattuapp.com.br/api/orders/scheduled', scheduledOrders); // URL para pedidos "Em preparação"
        fetchOrders('https://api.prattuapp.com.br/api/orders/status/3', readyForPickupOrders);
      };
  
      const openPopup = (orderId) => {
        selectedOrderId.value = orderId;
        isPopupVisible.value = true;
      };
  
      const closePopup = () => {
        isPopupVisible.value = false;
      };
  
      onMounted(fetchAllOrders);
  
      return {
        pendingOrders,
        scheduledOrders,
        readyForPickupOrders,
        selectedOrderId,
        isPopupVisible,
        navbarData,
        sidebarData,
        openPopup,
        closePopup,
      };
    },
  };
  </script>
<style scoped>
.performance.container-report {
  padding: 20px;
}

.report-titles {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button-group {
  display: flex;
  gap: 10px;
  align-items: center;
}

/* Novas classes para os botões */
.btn-pause-orders, .btn-adjust-time {
  display: flex;
  align-items: center;
  padding: 5px 10px;
  border-radius: 9px;
  border: 1px solid transparent;
  cursor: pointer;
  background: none;
  color: #000; /* Cor do texto preta */
  font-size: 14px;
  transition: background-color 0.3s, border-color 0.3s;
}

.btn-pause-orders img, .btn-adjust-time img {
  margin-right: 5px;
  height: 16px;
}

/* Estilos específicos de cada botão */
.btn-pause-orders {
  border-color: #e14d4d;
}

.btn-pause-orders:hover {
  background-color: rgba(225, 77, 77, 0.1); /* Leve overlay vermelho */
  border-color: #d43b3b; /* Vermelho mais escuro no hover */
}

.btn-adjust-time {
  border-color: #7ed957;
}

.btn-adjust-time:hover {
  background-color: rgba(126, 217, 87, 0.1); /* Leve overlay verde */
  border-color: #6bcf46; /* Verde mais escuro no hover */
}

.orders-wrapper {
  display: flex;
  flex-direction: column;
}

.orders-container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.orders-column {
  flex: 1;
  background-color: #fff;
  border-radius: 0px 16px 16px 16px;
  display: flex;
  flex-direction: column;
  position: relative;
}

.header-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0;
  height: 48px;
  background-color: #f1f4f4;
}

.header-title {
  background-color: #cecece;
  border-radius: 9px 9px 0px 0px;
  padding: 16px;
  width: auto;
  text-align: center;
  line-height: 16px;
  margin: 0;
}

.list-container {
  padding: 56px 24px 16px 24px; /* Ajuste do padding para espaço do cabeçalho */
  box-sizing: border-box;
  overflow-y: auto;
  border-radius: 16px;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.order-item {
  display: flex;
  flex-direction: column;
}

.no-orders-message {
  text-align: center;
  color: #999;
  margin-top: 20px;
}

</style>
