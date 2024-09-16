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
          <span class="value">{{ formattedTotal }}</span>
        </p>
        <div class="divider"></div>
      </div>
    </div>
    <div v-if="isExpanded" class="card-footer">
      <button @click.stop="acceptOrder" class="btn accept">Aceitar</button>
      <button @click.stop="rejectOrder" class="btn reject">Recusar</button>
      <button @click.stop="viewDetails" class="btn details">Detalhes</button>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex';

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
    formattedDate() {
      return new Date(this.order.created_at).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    },
    formattedTotal() {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(this.order.total);
    },
    timeAgo() {
      const now = new Date();
      const created = new Date(this.order.created_at);
      const diffInMinutes = Math.floor((now - created) / 60000);
      return diffInMinutes < 60
        ? `Há ${diffInMinutes} min`
        : `Há ${Math.floor(diffInMinutes / 60)} horas`;
    },
    statusColorClass() {
      const now = new Date();
      const created = new Date(this.order.created_at);
      const diffInMinutes = Math.floor((now - created) / 60000);
      return diffInMinutes < 5 ? 'status-green' : 'status-red';
    },
    toggleIconSrc() {
      return require('@/assets/img/arrow_drop_down.svg');
    },
  },
  methods: {
    toggleExpansion() {
      this.isExpanded = !this.isExpanded;
    },
    async acceptOrder() {
      try {
        const response = await fetch(
          `https://api.prattuapp.com.br/api/orders/${this.order.id}/mark-as-accepted`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${this.$store.state.token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        if (response.ok) {
          window.location.reload();
        } else {
          console.error('Erro ao aceitar o pedido:', response.statusText);
        }
      } catch (error) {
        console.error('Erro ao aceitar o pedido:', error);
      }
    },
    rejectOrder() {
      // Lógica para recusar o pedido
    },
    viewDetails() {
      this.$emit('view-details', this.order.id);
    },
  },
};
</script>

  
  <style scoped>
  .order-card {
    border: 1px solid #FB9F9F; /* Cor verde claro */
    border-radius: 4px;
    margin-bottom: 10px;
    transition: border-color 0.3s, max-height 0.3s ease;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    overflow: hidden;
    padding: 8px 8px;
   
  }
  .order-card.expanded {
    border-color: #FB9F9F;
    
  }
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
  }
  .card-header h3 {
  margin: 0; /* Remove possíveis margens que podem desalinhar o elemento */
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
     transform: rotate(180deg);
  }
  .toggle-icon.rotated {
    transform: rotate(0deg);
  }
  .card-body {
    padding: 10px;
    gap: 10px;
  }
  .detail {
    display: flex;
    flex-direction: column;
   
  }
  .detail-item {
    display: flex;
    justify-content: space-between;
  }
  .divider {
    border-bottom: 1px solid #d3d3d3;
    margin: 0px 0 10px 0;
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
    border-radius: 26px;
  }
  .accept {
    background-color: #baedbd;
    color: black;
  }
  .reject {
    background-color: #fb9f9f;
    color: black;
  }
  .details {
    background-color: #f0f0f0;
    color: #333;
  }
  .btn {
    border-radius: 100px !important;
  }
  </style>
  