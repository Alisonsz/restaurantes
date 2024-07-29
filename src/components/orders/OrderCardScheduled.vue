<template>
    <div :class="['order-card', { expanded: isExpanded }]" @click="toggleExpansion">
      <div class="card-header">
        <h3>{{ order.user.name }}</h3>
        <div class="header-right">
          <span :class="['status', statusColorClass]">{{ timeAgo }}</span>
          <img class="toggle-icon" :src="toggleIconSrc" :class="{ rotated: isExpanded }" alt="toggle" />
        </div>
      </div>
      <div v-if="isExpanded" class="card-body">
        <div class="detail">
          <p class="detail-item">
            <span class="label">Data e hora:</span>
            <span class="value">{{ formattedDate }}</span>
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
        <div class="detail">
          <p class="detail-item">
            <span class="label">Tempo de preparo:</span>
            <span class="value">{{ order.restaurant.preparation_time }} minutos</span>
          </p>
          <div class="divider"></div>
        </div>
        <div class="detail">
          <p class="detail-item">
            <span class="label">Horário da retirada:</span>
            <span class="value">{{ formattedEstimatedDate }}</span>
          </p>
        </div>
      </div>
      <div v-if="isExpanded" class="card-footer">
        <button @click.stop="viewDetails" class="btn details">Detalhes</button>
        <button @click.stop="handleAction" :class="['btn accept', actionButtonClass]">{{ actionButtonText }}</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      order: {
        type: Object,
        required: true,
        // Incluindo as informações do pedido
      },
    },
    data() {
      return {
        isExpanded: false,
      };
    },
    computed: {
      formattedDate() {
        return new Date(this.order.created_at).toLocaleString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      },
      formattedEstimatedDate() {
        return new Date(this.order.estimated_delivery_datetime).toLocaleString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      },
      timeAgo() {
        const now = new Date();
        const estimated = new Date(this.order.estimated_delivery_datetime);
        const diffInMinutes = Math.floor((estimated - now) / 60000);
  
        if (diffInMinutes < 0) {
          return 'ATRASADO';
        } else if (diffInMinutes < 60) {
          return `Faltam ${diffInMinutes} min`;
        } else {
          return `Faltam ${Math.floor(diffInMinutes / 60)} horas`;
        }
      },
      statusColorClass() {
        return this.timeAgo === 'ATRASADO' ? 'status-red' : 'status-green';
      },
      toggleIconSrc() {
        return require('@/assets/img/arrow_drop_down.svg');
      },
      actionButtonText() {
        return this.order.status === '2' ? 'Pronto para Retirada' : 'Iniciar Preparo';
      },
      actionButtonClass() {
        return this.order.status === '2' ? 'btn-ready' : 'btn-start';
      }
    },
    methods: {
      toggleExpansion() {
        this.isExpanded = !this.isExpanded;
      },
      handleAction() {
        if (this.order.status === '2') {
          this.markAsReady();
        } else if (this.order.status === '4') {
          this.startPreparation();
        }
      },
      async markAsReady() {
        try {
          const response = await fetch(`https://api.prattuapp.com.br/api/orders/${this.order.id}/mark-ready`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.$store.state.token}`,
              'Content-Type': 'application/json',
            },
          });
          if (response.ok) {
            window.location.reload();
          } else {
            console.error('Erro ao marcar como pronto:', response.statusText);
          }
        } catch (error) {
          console.error('Erro ao marcar como pronto:', error);
        }
      },
      async startPreparation() {
        try {
          const response = await fetch(`https://api.prattuapp.com.br/api/orders/${this.order.id}/start-preparation`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${this.$store.state.token}`,
              'Content-Type': 'application/json',
            },
          });
          if (response.ok) {
            window.location.reload();
          } else {
            console.error('Erro ao iniciar preparo:', response.statusText);
          }
        } catch (error) {
          console.error('Erro ao iniciar preparo:', error);
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
    border: 1px solid #baedbd; /* Cor verde claro */
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
  .status-red {
    background-color: #fb9f9f;
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
  .accept {
    background-color: #baedbd;
    color: black;
  }
  .reject {
    background-color: #fb9f9f;
    color: black;
  }
  </style>
  