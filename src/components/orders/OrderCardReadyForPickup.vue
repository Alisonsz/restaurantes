<template>
    <div :class="['order-card', { expanded: isExpanded }]" @click="toggleExpansion">
      <div class="card-header">
        <h3>{{ order.user.name }}</h3>
        <div class="header-right">
          <span :class="['status', statusColorClass]">{{ timeSinceReady }}</span>
          <img class="toggle-icon" :src="toggleIconSrc" :class="{ rotated: isExpanded }" alt="toggle" />
        </div>
      </div>
      <div v-if="isExpanded" class="card-body">
        <div class="detail">
          <p class="detail-item">
            <span class="label">Data e hora:</span>
            <span class="value">{{ formattedAcceptedDate }}</span>
          </p>
          <div class="divider"></div>
        </div>
        <div class="detail">
          <p class="detail-item">
            <span class="label">Pedido finalizado:</span>
            <span class="value">{{ formattedReadyDate }}</span>
          </p>
          <div class="divider"></div>
        </div>
        <div class="detail">
          <p class="detail-item">
            <span class="label">Tempo de preparo:</span>
            <span class="value">{{ preparationTime }} minutos</span>
          </p>
          <div class="divider"></div>
        </div>
        <div class="detail">
          <p class="detail-item">
            <span class="label">Valor:</span>
            <span class="value">R$ {{ order.total }}</span>
          </p>
          <div class="divider"></div>
        </div>
      
       
      </div>
      <div v-if="isExpanded" class="card-footer">
        <button @click.stop="viewDetails" class="btn details">Detalhes</button>
        <button @click.stop="finalizeOrder" class="btn btn-ready">Pedido Finalizado</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      order: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        isExpanded: false,
      };
    },
    computed: {
      formattedAcceptedDate() {
        return new Date(this.order.accepted_datetime).toLocaleString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      },
      formattedReadyDate() {
        return new Date(this.order.ready_datetime).toLocaleString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      },
      preparationTime() {
        const acceptedTime = new Date(this.order.accepted_datetime).getTime();
        const readyTime = new Date(this.order.ready_datetime).getTime();
        return Math.round((readyTime - acceptedTime) / 60000); // Calcula a diferença em minutos
      },
      timeSinceReady() {
        const now = new Date();
        const readyTime = new Date(this.order.ready_datetime);
        const diffInMinutes = Math.floor((now - readyTime) / 60000);
        return diffInMinutes < 60 ? `Há ${diffInMinutes} min` : `Há ${Math.floor(diffInMinutes / 60)} horas`;
      },
      statusColorClass() {
        return 'status-green';
      },
      toggleIconSrc() {
        return require('@/assets/img/arrow_drop_down.svg');
      },
    },
    methods: {
      toggleExpansion() {
        this.isExpanded = !this.isExpanded;
      },
      async finalizeOrder() {
        try {
          const response = await fetch(`https://api.prattuapp.com.br/api/orders/${this.order.id}/mark-as-delivered`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.$store.state.token}`,
              'Content-Type': 'application/json',
            },
          });
          if (response.ok) {
            window.location.reload();
          } else {
            console.error('Erro ao finalizar pedido:', response.statusText);
          }
        } catch (error) {
          console.error('Erro ao finalizar pedido:', error);
        }
      },
      viewDetails() {
        this.$emit('view-details', this.order.id);
      },
    },
  };
  </script>
  
  <style scoped>
  .order-card {
    border: 1px solid #baedbd;
    border-radius: 4px;
    margin-bottom: 10px;
    transition: border-color 0.3s, max-height 0.3s ease;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    overflow: hidden;
  }
  .order-card.expanded {
    border-color: #baedbd;
  }
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
  }
  .header-right {
    display: flex;
    align-items: center;
  }
  .status {
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 0.9rem;
    margin-right: 10px;
  }
  .status-green {
    background-color: #baedbd;
  }
  .toggle-icon {
    width: 20px;
    height: 20px;
    transition: transform 0.3s;
  }
  .toggle-icon.rotated {
    transform: rotate(180deg);
  }
  .card-body {
    padding: 10px;
  }
  .detail {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
  }
  .detail-item {
    display: flex;
    justify-content: space-between;
  }
  .divider {
    border-bottom: 1px solid #d3d3d3;
    margin: 5px 0 10px 0;
  }
  .card-footer {
    display: flex;
    justify-content: flex-start;
    padding: 10px;
  }
  .btn {
    padding: 8px 16px;
    border-radius: 26px;
    cursor: pointer;
    font-size: 0.9rem;
    border: none;
    margin-right: 8px;
  }
  .details {
    background-color: #f0f0f0;
    color: #333;
  }
  .btn-ready {
    background-color: #baedbd;
    color: black;
  }
  </style>
  